import { ConnectorMetadata } from '@wippa/connectors-framework'
import {
    EngineResponse,
    EngineResponseStatus,
    ExecuteExtractPieceMetadataOperation,
} from '@wippa/shared'
import { EngineConstants } from '../handler/context/engine-constants'
import { connectorHelper } from '../helper/piece-helper'


export const pieceMetadataOperation = {
    extract: async (operation: ExecuteExtractPieceMetadataOperation): Promise<EngineResponse<ConnectorMetadata>>  => {
        const input = operation as ExecuteExtractPieceMetadataOperation
        const output = await connectorHelper.extractPieceMetadata({
            params: input,
            devPieces: EngineConstants.DEV_PIECES,
        })
        return {
            status: EngineResponseStatus.OK,
            response: output,
        }
    },
}