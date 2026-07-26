import { ActivepiecesError, assertNotNullOrUndefined, ErrorCode } from '@wippa/core-utils'

/**
 * @param {string} connectorName - starts with `@wippa/connector-`
 * @param {string} connectorVersion - the version of the connector
 * @returns {string} the package alias for the connector, e.g. `@wippa/connector-activepieces-0.0.1`
 */
export const getPackageAliasForConnector = (params: GetPackageAliasForConnectorParams): string => {
    const { connectorName, connectorVersion } = params
    return `${connectorName}-${connectorVersion}`
}

/**
 * @param {string} alias - e.g. connector-activepieces or @publisher/connector-activepieces or activepieces or @publisher/activepieces 
 * @returns {string} the connector name, e.g. activepieces
 */
export const getConnectorNameFromAlias = (alias: string): string => {
    const fullPieceName =  alias.startsWith('@') ? alias.split('/').pop() : alias
    assertNotNullOrUndefined(fullPieceName, 'Full connector name')
    if (fullPieceName.startsWith('connector-')) {
        return fullPieceName.split('-').slice(1).join('-')
    }
    return fullPieceName
}

/**
 * @param {string} alias - e.g. `@wippa/connector-activepieces-0.0.1`
 * @returns {string} the connector name, e.g. `@wippa/connector-activepieces`
 */
export const trimVersionFromAlias = (alias: string): string => {
    return alias.split('-').slice(0, -1).join('-')
}



export const extractConnectorFromModule = <T>(params: ExtractConnectorFromModuleParams): T => {
    const { module, connectorName, connectorVersion } = params
    const exports = Object.values(module)
    const constructors = []
    for (const e of exports) {
        if (e !== null && e !== undefined && e.constructor.name === 'Connector') {
            return e as T
        }
        constructors.push(e?.constructor?.name)
    }

    throw new ActivepiecesError({
        code: ErrorCode.ENTITY_NOT_FOUND,
        params: {
            entityType: 'connector',
            entityId: connectorName,
            message: `Failed to extract connector from module (version: ${connectorVersion}), found constructors: ${constructors.join(', ')}`,
            extra: { connectorName, connectorVersion },
        },
    })
}

export { getConnectorMajorAndMinorVersion } from './version-utils'

type GetPackageAliasForConnectorParams = {
    connectorName: string
    connectorVersion: string
}

type ExtractConnectorFromModuleParams = {
    module: Record<string, unknown>
    connectorName: string
    connectorVersion: string
}
export const MAX_KEY_LENGTH_FOR_CORWDIN = 512
