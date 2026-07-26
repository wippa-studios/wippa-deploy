import {
    EngineResponse,
    EngineResponseStatus,
    ExecuteValidateAuthOperation,
    ExecuteValidateAuthResponse,
} from '@wippa/shared'
import { EngineConstants } from '../handler/context/engine-constants'
import { connectorHelper } from '../helper/piece-helper'

export const authValidationOperation = {
    execute: async (operation: ExecuteValidateAuthOperation): Promise<EngineResponse<ExecuteValidateAuthResponse>> => {
        const input = operation as ExecuteValidateAuthOperation
        const output = await connectorHelper.executeValidateAuth({
            params: input,
            devPieces: EngineConstants.DEV_PIECES,
        })

        return {
            status: EngineResponseStatus.OK,
            response: output,
        }
    },
}