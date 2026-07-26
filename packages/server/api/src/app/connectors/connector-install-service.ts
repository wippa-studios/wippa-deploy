import { ActivepiecesError, ErrorCode, isNil, PlatformId, ProjectId } from '@wippa/core-utils'
import { ConnectorMetadata, PieceMetadataModel } from '@wippa/connectors-framework'
import { AddPieceRequestBody, EngineResponse, EngineResponseStatus, ExecuteExtractPieceMetadata, FileCompression, FileId, FileType, PackageType, ConnectorPackage, ConnectorType, WorkerJobType } from '@wippa/shared'
import { FastifyBaseLogger } from 'fastify'
import { fileService } from '../file/file.service'
import { rejectedPromiseHandler } from '../helper/promise-handler'
import { isToolSearchEnabled } from '../tool-search/tool-search-flag'
import { toolSearchReindexJob } from '../tool-search/tool-search-reindex.job'
import { userInteractionWatcher } from '../workers/user-interaction-watcher'
import { pieceMetadataService } from './metadata/piece-metadata-service'

export const connectorInstallService = (log: FastifyBaseLogger) => ({
    async installConnector(
        platformId: string,
        params: AddPieceRequestBody,
    ): Promise<PieceMetadataModel> {
        try {
            const connectorPackage = await savePiecePackage(platformId, params, log)
            const pieceInformation = await extractPieceInformation({
                ...connectorPackage,
                platformId,
            }, log)
            const archiveId = connectorPackage.packageType === PackageType.ARCHIVE ? connectorPackage.archiveId : undefined
            const savedPiece = await pieceMetadataService(log).create({
                connectorMetadata: {
                    ...pieceInformation,
                    minimumSupportedRelease:
                        pieceInformation.minimumSupportedRelease ?? '0.0.0',
                    maximumSupportedRelease:
                        pieceInformation.maximumSupportedRelease ?? '999.999.999',
                    name: pieceInformation.name,
                    version: pieceInformation.version,
                    i18n: pieceInformation.i18n,
                },
                packageType: params.packageType,
                platformId,
                pieceType: ConnectorType.CUSTOM,
                archiveId,
            })
            // Reconcile tool-search for this tenant only (async, never blocking the install) so the new
            // custom piece's actions/triggers become searchable. Scoped → the shared catalog is untouched.
            // Gated on the flag so an install never enqueues a reconcile while tool-search is disabled.
            if (isToolSearchEnabled()) {
                rejectedPromiseHandler(toolSearchReindexJob(log).enqueue({ type: 'platform', platformId }), log)
            }
            return savedPiece
        }
        catch (error) {
            log.error({ error }, '[connectorInstallService#add] Failed to add piece')

            if (error instanceof ActivepiecesError && error.error.code === ErrorCode.VALIDATION) {
                throw error
            }
            throw new ActivepiecesError({
                code: ErrorCode.ENGINE_OPERATION_FAILURE,
                params: {
                    message: error instanceof Error ? error.message : String(error),
                },
            })
        }
    },
})


async function savePiecePackage(platformId: string | undefined, params: AddPieceRequestBody, log: FastifyBaseLogger): Promise<ConnectorPackage> {

    switch (params.packageType) {
        case PackageType.ARCHIVE: {
            const archiveId = await saveArchive({
                projectId: undefined,
                platformId,
                archive: params.pieceArchive.data as Buffer,
            }, log)
            return {
                ...params,
                pieceType: ConnectorType.CUSTOM,
                archiveId,
                platformId: platformId!,
                packageType: params.packageType,
            }
        }

        case PackageType.REGISTRY: {
            return {
                ...params,
                pieceType: ConnectorType.CUSTOM,
                platformId: platformId!,
            }
        }
    }
}

const extractPieceInformation = async (request: ExecuteExtractPieceMetadata, log: FastifyBaseLogger): Promise<ConnectorMetadata> => {
    const engineResponse = await userInteractionWatcher.submitAndWaitForResponse<EngineResponse<ConnectorMetadata>>({
        jobType: WorkerJobType.EXECUTE_EXTRACT_PIECE_INFORMATION,
        platformId: request.platformId,
        piece: request,
        projectId: undefined,
    }, log)

    if (engineResponse.status !== EngineResponseStatus.OK) {
        throw new Error(engineResponse.error)
    }
    return engineResponse.response
}

const saveArchive = async (
    params: GetPieceArchivePackageParams,
    log: FastifyBaseLogger,
): Promise<FileId> => {
    const { projectId, platformId, archive } = params

    const archiveFile = await fileService(log).save({
        projectId: isNil(platformId) ? projectId : undefined,
        platformId,
        data: archive,
        size: archive.length,
        type: FileType.PACKAGE_ARCHIVE,
        compression: FileCompression.NONE,
    })

    return archiveFile.id
}

type GetPieceArchivePackageParams = {
    archive: Buffer
    projectId?: ProjectId
    platformId?: PlatformId
}

