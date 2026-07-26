import path from 'path'
import { ActivepiecesError, ErrorCode } from '@wippa/core-utils'
import { type ApLogger, wideEvent } from '@wippa/server-utils'
import { ApEnvironment, EXACT_VERSION_REGEX, PackageType, ConnectorPackage, ConnectorType, WorkerToApiContract } from '@wippa/shared'
import { SandboxSettings } from '../../types'
import { cacheUtils } from '../cache-paths'
import { cacheState, NO_SAVE_GUARD } from '../cache-state'
import { isValidPackageName } from './connector-installer'

export const connectorCache = (log: ApLogger, apiClient: WorkerToApiContract, basePath: string, getSettings: () => SandboxSettings) => ({
    async getConnector({ connectorName, connectorVersion, platformId }: PieceCacheKey): Promise<ConnectorPackage> {
        if (!isValidPackageName(connectorName)) {
            throw new ActivepiecesError({
                code: ErrorCode.VALIDATION,
                params: { message: `Invalid connectorName: "${connectorName}" is not a valid package name` },
            })
        }
        const isExactVersion = EXACT_VERSION_REGEX.test(connectorVersion)

        if (!isExactVersion) {
            return getPiecePackage({ connectorName, connectorVersion, platformId }, apiClient)
        }

        const cacheKey = `${connectorName}-${connectorVersion}-${platformId}`
        const cache = cacheState(path.join(cacheUtils(basePath).getGlobalCachePiecesPath(), cacheKey))

        const { state, cacheHit } = await cache.getOrSetCache({
            key: cacheKey,
            cacheMiss: (_: string) => {
                const environment = getSettings().ENVIRONMENT
                if (environment === ApEnvironment.TESTING) {
                    return true
                }
                const devPieces = getSettings().DEV_PIECES
                if (devPieces.includes(connectorName)) {
                    return true
                }
                return false
            },
            installFn: async () => {
                return wideEvent.timed({
                    name: 'pieceFetch',
                    fn: async () => {
                        const connectorPackage = await getPiecePackage({ connectorName, connectorVersion, platformId }, apiClient)
                        log.info({ piece: { name: connectorName, version: connectorVersion }, platform: { id: platformId } }, 'Cached piece')
                        return JSON.stringify(connectorPackage)
                    },
                })
            },
            skipSave: NO_SAVE_GUARD,
        })

        wideEvent.set({ pieceCacheHit: cacheHit })

        return JSON.parse(state as string) as ConnectorPackage
    },
})

async function getPiecePackage(query: PieceCacheKey, apiClient: WorkerToApiContract): Promise<ConnectorPackage> {
    const connectorMetadata = await apiClient.getConnector({
        name: query.connectorName,
        version: query.connectorVersion,
        platformId: query.platformId,
    }) as { packageType: PackageType, name: string, version: string, pieceType: ConnectorType, archiveId?: string } | null

    if (!connectorMetadata) {
        throw new PieceNotFoundError(query.connectorName, query.connectorVersion)
    }

    const baseProps = {
        packageType: connectorMetadata.packageType,
        connectorName: connectorMetadata.name,
        connectorVersion: connectorMetadata.version,
        pieceType: connectorMetadata.pieceType,
    }

    if (connectorMetadata.packageType === PackageType.ARCHIVE) {
        return {
            ...baseProps,
            archiveId: connectorMetadata.archiveId!,
            platformId: query.platformId,
        } as ConnectorPackage
    }

    if (connectorMetadata.pieceType === ConnectorType.CUSTOM) {
        return {
            ...baseProps,
            platformId: query.platformId,
        } as ConnectorPackage
    }

    return baseProps as ConnectorPackage
}

export class PieceNotFoundError extends Error {
    constructor(readonly connectorName: string, readonly connectorVersion: string) {
        super(`Piece metadata not found for ${connectorName}@${connectorVersion}`)
        this.name = 'PieceNotFoundError'
    }
}

type PieceCacheKey = {
    connectorName: string
    connectorVersion: string
    platformId: string
}
