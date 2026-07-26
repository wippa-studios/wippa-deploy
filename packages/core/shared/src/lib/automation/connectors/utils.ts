import { ActivepiecesError, assertNotNullOrUndefined, ErrorCode } from '@wippa/core-utils'

/**
 * @param {string} connectorName - starts with `@wippa/connector-`
 * @param {string} connectorVersion - the version of the piece
 * @returns {string} the package alias for the piece, e.g. `@wippa/connector-activepieces-0.0.1`
 */
export const getPackageAliasForPiece = (params: GetPackageAliasForPieceParams): string => {
    const { connectorName, connectorVersion } = params
    return `${connectorName}-${connectorVersion}`
}

/**
 * @param {string} alias - e.g. piece-activepieces or @publisher/piece-activepieces or activepieces or @publisher/activepieces 
 * @returns {string} the piece name, e.g. activepieces
 */
export const getPieceNameFromAlias = (alias: string): string => {
    const fullPieceName =  alias.startsWith('@') ? alias.split('/').pop() : alias
    assertNotNullOrUndefined(fullPieceName, 'Full piece name')
    if (fullPieceName.startsWith('piece-')) {
        return fullPieceName.split('-').slice(1).join('-')
    }
    return fullPieceName
}

/**
 * @param {string} alias - e.g. `@wippa/connector-activepieces-0.0.1`
 * @returns {string} the piece name, e.g. `@wippa/connector-activepieces`
 */
export const trimVersionFromAlias = (alias: string): string => {
    return alias.split('-').slice(0, -1).join('-')
}



export const extractPieceFromModule = <T>(params: ExtractPieceFromModuleParams): T => {
    const { module, connectorName, connectorVersion } = params
    const exports = Object.values(module)
    const constructors = []
    for (const e of exports) {
        if (e !== null && e !== undefined && e.constructor.name === 'Piece') {
            return e as T
        }
        constructors.push(e?.constructor?.name)
    }

    throw new ActivepiecesError({
        code: ErrorCode.ENTITY_NOT_FOUND,
        params: {
            entityType: 'piece',
            entityId: connectorName,
            message: `Failed to extract piece from module (version: ${connectorVersion}), found constructors: ${constructors.join(', ')}`,
            extra: { connectorName, connectorVersion },
        },
    })
}

export { getPieceMajorAndMinorVersion } from './version-utils'

type GetPackageAliasForPieceParams = {
    connectorName: string
    connectorVersion: string
}

type ExtractPieceFromModuleParams = {
    module: Record<string, unknown>
    connectorName: string
    connectorVersion: string
}
export const MAX_KEY_LENGTH_FOR_CORWDIN = 512
