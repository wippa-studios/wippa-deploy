import { spawn } from 'node:child_process'
import { copyFile, cp } from 'node:fs/promises'
import { join } from 'path'
import { isNil } from '@wippa/core-utils'
import { memoryLock } from '@wippa/server-utils'
import { WebsocketClientEvent } from '@wippa/shared'
import chokidar from 'chokidar'
import { FastifyInstance } from 'fastify'
import { system } from '../helper/system/system'
import { AppSystemProp } from '../helper/system/system-props'
import { fileConnectorsUtils } from './metadata/utils/file-connectors-utils'
import { invalidateDevPieceCache } from './metadata/utils/connector-cache-utils'

const PIECES_BUILDER_MUTEX_KEY = 'pieces-builder'

async function buildPieces(app: FastifyInstance, piecesInfo: ConnectorInfo[]): Promise<void> {
    if (piecesInfo.length === 0) return

    for (const piece of piecesInfo) {
        if (!/^[A-Za-z0-9-]+$/.test(piece.connectorName)) {
            throw new Error(`Piece package name contains invalid character: ${piece.connectorName}`)
        }
    }

    const pieceFilters = piecesInfo.map(p => `--filter=${p.packageName}`)
    const filterArgs = [
        '--filter=@wippa/connectors-framework',
        '--filter=@wippa/connectors-common',
        '--filter=@wippa/shared',
        ...pieceFilters,
        '--force',
    ]
    app.log.info(`Building ${piecesInfo.length} piece(s): ${piecesInfo.map(p => p.connectorName).join(',')}...`)

    const lock = await memoryLock.acquire(PIECES_BUILDER_MUTEX_KEY)
    try {
        const startTime = performance.now()
        await spawnAndWait('npx', ['turbo', 'run', 'build', ...filterArgs])
        const buildTime = (performance.now() - startTime) / 1000

        app.log.info(`Build completed in ${buildTime.toFixed(2)} seconds`)

        const utils = fileConnectorsUtils(app.log)
        await Promise.all(piecesInfo.map(async (piece) => {
            await copyPackageJsonToDist(piece.pieceDirectory)
            await copyI18nToDist(piece.pieceDirectory)
            const distPath = await utils.findDistPiecePathByPackageName(piece.packageName)
            if (distPath) {
                utils.clearPieceModuleCache(distPath)
            }
        }))

        invalidateDevPieceCache()
        app.io.emit(WebsocketClientEvent.REFRESH_PIECE)
        app.log.info('Changes are ready! Please refresh the frontend to see the new updates.')
    }
    catch (error) {
        app.log.error({ error }, 'Failed to run build process...')
    }
    finally {
        await lock.release()
    }
}

export async function startDevPieceWatcher(app: FastifyInstance): Promise<void> {
    const devPiecesConfig = system.get(AppSystemProp.DEV_PIECES)
    if (isNil(devPiecesConfig) || devPiecesConfig.trim() === '') return

    const piecesNames = [...new Set(devPiecesConfig.split(',').map(n => n.trim()))]
    const utils = fileConnectorsUtils(app.log)

    const resolvedInfos = await Promise.all(piecesNames.map(async (connectorName) => {
        const pieceDirectory = await utils.findSourcePiecePathByPieceName(connectorName)
        if (isNil(pieceDirectory)) {
            app.log.warn(`Piece directory not found for: ${connectorName}`)
            return null
        }
        const packageName = await utils.getPackageNameFromFolderPath(pieceDirectory)
        return { connectorName, pieceDirectory, packageName }
    }))
    const pieceInfos: ConnectorInfo[] = resolvedInfos.filter((info): info is ConnectorInfo => info !== null)

    if (pieceInfos.length === 0) return

    const rebuilding = new Set<string>()
    const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()
    const pendingRebuild = new Set<string>()

    const watchPaths = pieceInfos.flatMap(p => [
        join(p.pieceDirectory, 'src'),
        join(p.pieceDirectory, 'package.json'),
    ])

    const triggerBuild = async (connectorInfo: ConnectorInfo) => {
        rebuilding.add(connectorInfo.connectorName)
        try {
            await buildPieces(app, [connectorInfo])
        }
        finally {
            rebuilding.delete(connectorInfo.connectorName)
        }
        if (pendingRebuild.has(connectorInfo.connectorName)) {
            pendingRebuild.delete(connectorInfo.connectorName)
            void triggerBuild(connectorInfo)
        }
    }

    const watcher = chokidar.watch(watchPaths, { ignoreInitial: true })

    watcher.on('all', (_event, filePath) => {
        const connectorInfo = pieceInfos.find(p => filePath.startsWith(p.pieceDirectory))
        if (!connectorInfo) return

        clearTimeout(debounceTimers.get(connectorInfo.connectorName))
        debounceTimers.set(connectorInfo.connectorName, setTimeout(() => {
            debounceTimers.delete(connectorInfo.connectorName)
            if (rebuilding.has(connectorInfo.connectorName)) {
                pendingRebuild.add(connectorInfo.connectorName)
                return
            }
            void triggerBuild(connectorInfo)
        }, 300))
    })

    watcher.on('error', (error) => {
        app.log.error({ error }, 'File watcher error')
    })

    for (const connectorInfo of pieceInfos) {
        app.log.info(`Watching for changes: ${connectorInfo.connectorName}`)
    }

    const cleanup = async () => {
        await watcher.close()
        for (const timer of debounceTimers.values()) {
            clearTimeout(timer)
        }
    }
    process.once('SIGINT', () => void cleanup())
    process.once('SIGTERM', () => void cleanup())
}

function spawnAndWait(cmd: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, {
            cwd: process.cwd(),
            stdio: 'inherit',
            shell: false,
        })
        child.on('close', (code) => {
            if (code === 0) {
                resolve()
            }
            else {
                reject(new Error(`Command "${cmd}" exited with code ${code}`))
            }
        })
        child.on('error', reject)
    })
}

async function copyPackageJsonToDist(sourceDir: string): Promise<void> {
    const distDir = join(sourceDir, 'dist')
    await copyFile(join(sourceDir, 'package.json'), join(distDir, 'package.json'))
}

async function copyI18nToDist(sourceDir: string): Promise<void> {
    const i18nSrc = join(sourceDir, 'src', 'i18n')
    const distDir = join(sourceDir, 'dist')
    try {
        await cp(i18nSrc, join(distDir, 'src', 'i18n'), { recursive: true })
    }
    catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    }
}

type ConnectorInfo = {
    packageName: string
    connectorName: string
    pieceDirectory: string
}
