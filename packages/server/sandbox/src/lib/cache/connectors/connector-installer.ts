import { rm, writeFile } from 'node:fs/promises'
import path, { dirname, join } from 'node:path'
import { ensureTrailingSlash, groupBy, isEmpty, isNil, tryCatch } from '@wippa/core-utils'
import { type ApLogger, fileSystemUtils, memoryLock, wideEvent } from '@wippa/server-utils'
import { ExecutionMode, getPieceNameFromAlias, PackageType, ConnectorPackage, ConnectorType } from '@wippa/shared'
import writeFileAtomic from 'write-file-atomic'
import { SandboxSettings } from '../../types'
import { bunRunner } from '../../utils/bun-runner'
import { cacheUtils } from '../cache-paths'

const usedPiecesMemoryCache: Record<string, boolean> = {}
const VALID_SCOPED_NAME_REGEX = /^@[^/]+\/[^/]+$/
const VALID_UNSCOPED_NAME_REGEX = /^[^/]+$/
const relativePiecePath = (piece: ConnectorPackage) => join('./', 'pieces', `${piece.connectorName}-${piece.connectorVersion}`)
const piecePath = (rootWorkspace: string, piece: ConnectorPackage) => join(rootWorkspace, 'pieces', `${piece.connectorName}-${piece.connectorVersion}`)

export const pieceInstaller = (log: ApLogger, basePath: string, getSettings: () => SandboxSettings) => ({
    async install({ pieces, includeFilters, publicApiUrl, engineToken }: InstallParams): Promise<void> {
        const groupedPieces = groupPiecesByPackagePath(pieces, basePath, getSettings)
        const installPromises = Object.entries(groupedPieces).map(async ([packagePath, piecesInGroup]) => {
            await installPieces(packagePath, piecesInGroup, includeFilters, log, { publicApiUrl, engineToken }, getSettings)
        })
        await Promise.all(installPromises)
    },

    getCustomPiecesPath(platformId: string): string {
        return getCustomPiecesPath(basePath, platformId, getSettings)
    },
})

function getCustomPiecesPath(basePath: string, platformId: string, getSettings: () => SandboxSettings): string {
    const paths = cacheUtils(basePath)
    switch (getSettings().EXECUTION_MODE) {
        case ExecutionMode.SANDBOX_PROCESS:
        case ExecutionMode.SANDBOX_CODE_AND_PROCESS:
            return path.resolve(paths.getGlobalCachePathLatestVersion(), 'custom_pieces', platformId)
        case ExecutionMode.UNSANDBOXED:
        case ExecutionMode.SANDBOX_CODE_ONLY:
            return paths.getGlobalCacheCommonPath()
        default:
            throw new Error('Invalid execution mode')
    }
}

async function installPieces(rootWorkspace: string, pieces: ConnectorPackage[], includeFilters: boolean, log: ApLogger, bundleSource: BundleSource, getSettings: () => SandboxSettings): Promise<void> {
    const devPieces = getSettings().DEV_PIECES
    const nonDevPieces = pieces.filter(piece => !devPieces.includes(getPieceNameFromAlias(piece.connectorName)))
    const { validPieces, invalidPieces } = partitionValidPieceNames(nonDevPieces)
    if (!isEmpty(invalidPieces)) {
        log.error({
            rootWorkspace,
            invalidPieces: invalidPieces.map(piece => `${piece.connectorName}@${piece.connectorVersion}`),
        }, '[pieceInstaller] Skipping pieces with invalid package names to protect the shared lockfile')
    }
    const { piecesToInstall } = await partitionPiecesToInstall(rootWorkspace, validPieces)

    if (isEmpty(piecesToInstall)) {
        log.debug({ rootWorkspace }, '[pieceInstaller] No new pieces to install (already installed)')
        return
    }
    log.info({
        rootWorkspace,
        piecesToInstall: piecesToInstall.map(piece => `${piece.connectorName}-${piece.connectorVersion}`),
    }, '[pieceInstaller] Installing pieces in workspace')

    await memoryLock.runExclusive({
        key: `install-pieces-${rootWorkspace}`,
        fn: async () => {
            const { piecesToInstall } = await partitionPiecesToInstall(rootWorkspace, validPieces)
            if (isEmpty(piecesToInstall)) {
                log.info({ rootWorkspace }, '[pieceInstaller] No new pieces to install in lock (already installed)')
                return
            }
            log.info({
                rootWorkspace,
                pieces: piecesToInstall.map(piece => `${piece.connectorName}-${piece.connectorVersion}`),
            }, '[pieceInstaller] acquired lock and starting to install pieces')

            await createRootPackageJson({
                path: rootWorkspace,
            })

            await saveBundlesToDiskIfNotCached(rootWorkspace, piecesToInstall, bundleSource)

            await Promise.all(piecesToInstall.map(piece => createPiecePackageJson({
                rootWorkspace,
                connectorPackage: piece,
            })))

            await wideEvent.timed({
                name: 'bunInstall',
                fn: async () => {
                    const { error: batchError } = await tryCatch(async () => bunRunner(log).install({
                        path: rootWorkspace,
                        filtersPath: includeFilters ? piecesToInstall.map(relativePiecePath) : [],
                    }))

                    if (isNil(batchError)) {
                        await markPiecesAsUsed(rootWorkspace, piecesToInstall)
                        log.info({
                            rootWorkspace,
                            piecesCount: piecesToInstall.length,
                        }, '[pieceInstaller] Installed registry pieces using bun')
                        return
                    }

                    if (piecesToInstall.length === 1) {
                        log.error({ rootWorkspace, error: batchError }, '[pieceInstaller] Piece installation failed, rolling back')
                        await rollbackInstallation(rootWorkspace, piecesToInstall)
                        throw batchError
                    }

                    log.warn({
                        rootWorkspace,
                        pieces: piecesToInstall.map(piece => `${piece.connectorName}-${piece.connectorVersion}`),
                        error: batchError,
                    }, '[pieceInstaller] Batch install failed, retrying pieces individually')

                    const failedPieces = await tryInstallPiecesIndividually(rootWorkspace, piecesToInstall, log)

                    if (failedPieces.length > 0) {
                        const names = failedPieces.map(p => `${p.connectorName}@${p.connectorVersion}`).join(', ')
                        throw new Error(`[pieceInstaller] Failed to install: ${names}`)
                    }

                    log.info({
                        rootWorkspace,
                        piecesCount: piecesToInstall.length,
                    }, '[pieceInstaller] Installed registry pieces using bun (individual fallback)')
                },
            })
        },
    })
}

// A workspace member name (and its dependency key) must be a plain npm package name. A relative
// path such as `../../../common/pieces/@wippa/connector-x` — fed in via stale `usedPieces` data
// from a since-reverted build — makes bun write an unparseable resolution token into the SHARED
// bun.lock. That lock then fails to parse on the next install and takes down EVERY piece in the
// workspace (so cache pre-warm and the deploy fail). Worse, because the install joins the name onto
// `<workspace>/pieces/`, a `..` name escapes a per-platform `custom_pieces/<id>` workspace and lands
// the poisoned member inside the shared `common` workspace. Such names are skipped at the source.
export function isValidPackageName(name: string): boolean {
    if (name.includes('..')) {
        return false
    }
    return VALID_SCOPED_NAME_REGEX.test(name) || VALID_UNSCOPED_NAME_REGEX.test(name)
}

function partitionValidPieceNames(pieces: ConnectorPackage[]): { validPieces: ConnectorPackage[], invalidPieces: ConnectorPackage[] } {
    return {
        validPieces: pieces.filter(piece => isValidPackageName(piece.connectorName)),
        invalidPieces: pieces.filter(piece => !isValidPackageName(piece.connectorName)),
    }
}

async function rollbackInstallation(rootWorkspace: string, pieces: ConnectorPackage[]): Promise<void> {
    await Promise.all(pieces.map(piece => rm(path.resolve(rootWorkspace, relativePiecePath(piece)), {
        recursive: true,
        force: true,
    })))
}

async function tryInstallPiecesIndividually(
    rootWorkspace: string,
    pieces: ConnectorPackage[],
    log: ApLogger,
): Promise<ConnectorPackage[]> {
    const failures: ConnectorPackage[] = []
    for (const piece of pieces) {
        const { error } = await tryCatch(async () =>
            bunRunner(log).install({
                path: rootWorkspace,
                filtersPath: [relativePiecePath(piece)],
            }),
        )
        if (error) {
            log.error({
                piece: `${piece.connectorName}@${piece.connectorVersion}`,
                error,
            }, '[pieceInstaller] Individual piece installation failed, rolling back')
            await rollbackInstallation(rootWorkspace, [piece])
            failures.push(piece)
        }
        else {
            await markPiecesAsUsed(rootWorkspace, [piece])
        }
    }
    return failures
}

function groupPiecesByPackagePath(pieces: ConnectorPackage[], basePath: string, getSettings: () => SandboxSettings): Record<string, ConnectorPackage[]> {
    const paths = cacheUtils(basePath)
    return groupBy(pieces, (piece) => {
        switch (piece.packageType) {
            case PackageType.ARCHIVE:
                return getCustomPiecesPath(basePath, piece.platformId, getSettings)
            case PackageType.REGISTRY: {
                if (piece.pieceType === ConnectorType.CUSTOM && !isNil(piece.platformId)) {
                    return getCustomPiecesPath(basePath, piece.platformId, getSettings)
                }
                return paths.getGlobalCacheCommonPath()
            }
            default:
                throw new Error('Invalid package type')
        }
    })
}

async function createRootPackageJson({ path }: { path: string }): Promise<void> {
    const packageJsonPath = join(path, 'package.json')
    await fileSystemUtils.threadSafeMkdir(dirname(packageJsonPath))
    await writeFileAtomic(packageJsonPath, JSON.stringify({
        'name': 'fast-workspace',
        'version': '1.0.0',
        'workspaces': [
            'pieces/**',
        ],
    }, null, 2), 'utf8')
}

async function createPiecePackageJson({ rootWorkspace, connectorPackage }: {
    rootWorkspace: string
    connectorPackage: ConnectorPackage
}): Promise<void> {
    const packageJsonPath = join(piecePath(rootWorkspace, connectorPackage), 'package.json')

    const packageJson = {
        'name': `${connectorPackage.connectorName}-${connectorPackage.connectorVersion}`,
        'version': `${connectorPackage.connectorVersion}`,
        'dependencies': {
            [connectorPackage.connectorName]: bundleTgzPath(rootWorkspace, connectorPackage),
        },
    }
    await fileSystemUtils.threadSafeMkdir(dirname(packageJsonPath))
    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8')
}

function bundleTgzPath(rootWorkspace: string, piece: ConnectorPackage): string {
    return join(piecePath(rootWorkspace, piece), 'bundle.tgz')
}

// Downloads each piece tarball from the engine bundle endpoint (which 307-redirects to npm /
// signed-S3, or streams the custom archive) to a local .tgz. We download here — rather than handing
// the URL to `bun install` — because bun derives a cache directory name from the dependency spec,
// and a long signed-S3 / engine-token URL overflows the filesystem name limit (ENAMETOOLONG).
// `fetch` follows the redirect and carries the engine token in the Authorization header.
// ARCHIVE pieces are fetched by archiveId (they may not be registered in metadata yet, e.g. during
// EXTRACT_PIECE_METADATA); REGISTRY pieces by name@version.
async function saveBundlesToDiskIfNotCached(rootWorkspace: string, pieces: ConnectorPackage[], { publicApiUrl, engineToken }: BundleSource): Promise<void> {
    await Promise.all(pieces.map(async (piece) => {
        const bundlePath = bundleTgzPath(rootWorkspace, piece)
        if (await fileSystemUtils.fileExists(bundlePath)) {
            return
        }
        const url = pieceBundleEndpointUrl(publicApiUrl, piece)
        const response = await fetch(url, { headers: { Authorization: `Bearer ${engineToken}` } })
        if (!response.ok) {
            throw new Error(`Failed to fetch piece bundle ${piece.connectorName}@${piece.connectorVersion}: ${response.status} ${response.statusText}`)
        }
        await fileSystemUtils.threadSafeMkdir(dirname(bundlePath))
        await writeFile(bundlePath, Buffer.from(await response.arrayBuffer()))
    }))
}

function pieceBundleEndpointUrl(publicApiUrl: string, piece: ConnectorPackage): string {
    const base = `${ensureTrailingSlash(publicApiUrl)}v1/engine/pieces/bundle`
    if (piece.packageType === PackageType.ARCHIVE) {
        return `${base}?archiveId=${encodeURIComponent(piece.archiveId)}`
    }
    return `${base}?name=${encodeURIComponent(piece.connectorName)}&version=${encodeURIComponent(piece.connectorVersion)}`
}

async function partitionPiecesToInstall(rootWorkspace: string, pieces: ConnectorPackage[]): Promise<PieceInstallationResult> {
    const piecesWithCheck = await Promise.all(
        pieces.map(async (piece) => {
            const installed = await pieceCheckIfAlreadyInstalled(rootWorkspace, piece)
            return { piece, installed }
        }),
    )

    const piecesToInstall = piecesWithCheck.filter(({ installed }) => !installed).map(({ piece }) => piece)

    return {
        piecesToInstall,
    }
}

async function pieceCheckIfAlreadyInstalled(rootWorkspace: string, piece: ConnectorPackage): Promise<boolean> {
    const pieceFolder = piecePath(rootWorkspace, piece)
    if (usedPiecesMemoryCache[pieceFolder]) {
        return true
    }
    const readyExists = await fileSystemUtils.fileExists(join(pieceFolder, 'ready'))
    if (!readyExists) {
        return false
    }
    const nodeModulesExist = await fileSystemUtils.fileExists(join(pieceFolder, 'node_modules'))
    if (!nodeModulesExist) {
        await rm(join(pieceFolder, 'ready'), { force: true })
        return false
    }
    usedPiecesMemoryCache[pieceFolder] = true
    return true
}

async function markPiecesAsUsed(rootWorkspace: string, pieces: ConnectorPackage[]): Promise<void> {
    const writeToDiskJobs = pieces.map(async (piece) => {
        const pieceFolder = piecePath(rootWorkspace, piece)
        await fileSystemUtils.threadSafeMkdir(pieceFolder)
        await writeFileAtomic(
            join(pieceFolder, 'ready'),
            'true',
        )
    })
    await Promise.all(writeToDiskJobs)
}

type InstallParams = {
    pieces: ConnectorPackage[]
    includeFilters: boolean
    publicApiUrl: string
    engineToken: string
}

type BundleSource = {
    publicApiUrl: string
    engineToken: string
}

type PieceInstallationResult = {
    piecesToInstall: ConnectorPackage[]
}
