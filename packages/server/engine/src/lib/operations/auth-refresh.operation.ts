import {
    EngineResponse,
    EngineResponseStatus,
    ExecuteRefreshTokenAuthOperation,
    ExecuteRefreshTokenAuthResponse,
} from '@wippa/shared'
import { EngineConstants } from '../handler/context/engine-constants'
import { connectorHelper } from '../helper/piece-helper'

export const authRefreshOperation = {
    execute: async (operation: ExecuteRefreshTokenAuthOperation): Promise<EngineResponse<ExecuteRefreshTokenAuthResponse>> => {
        const output = await connectorHelper.executeRefreshTokenAuth({
            params: operation,
            devPieces: EngineConstants.DEV_PIECES,
        })
        return {
            status: EngineResponseStatus.OK,
            response: output,
        }
    },
}
