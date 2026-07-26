import { ExecutePropsResult, PropertyType } from '@wippa/connectors-framework'
import {
    EngineResponse,
    EngineResponseStatus,
    ExecutePropsOptions,
} from '@wippa/shared'
import { connectorHelper } from '../helper/piece-helper'


export const propertyOperation = {
    execute: async (operation: ExecutePropsOptions): Promise<EngineResponse<ExecutePropsResult<PropertyType.DROPDOWN | PropertyType.MULTI_SELECT_DROPDOWN | PropertyType.DYNAMIC>>> => {
        const output = await connectorHelper.executeProps({
            ...operation,
            connectorName: operation.piece.connectorName,
            connectorVersion: operation.piece.connectorVersion,
        })
        return {
            status: EngineResponseStatus.OK,
            response: output,
        }
    },
}