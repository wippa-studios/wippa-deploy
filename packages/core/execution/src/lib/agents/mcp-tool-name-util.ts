const MAX_PREFIX_LENGTH = 53

function shortHash(str: string): string {
    let h = 5381
    for (let i = 0; i < str.length; i++) {
        h = (Math.imul(h, 33) ^ str.charCodeAt(i)) >>> 0
    }
    return h.toString(36).padStart(6, '0').slice(-6)
}

/**
 * Normalizes a string for use as an agent tool name.
 * Format: {prefix_up_to_53_chars}_{6char_hash}_mcp (≤ 64 chars total)
 */
function createToolName(name: string): string {
    const sanitized = name
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')
    const prefix = sanitized.slice(0, MAX_PREFIX_LENGTH)
    const hash = shortHash(sanitized)
    return `${prefix}_${hash}_mcp`
}

/**
 * Strips the @scope/piece- prefix from connectorName (e.g. @wippa/connector-slack → slack)
 * and delegates to createToolName.
 */
function createPieceToolName(connectorName: string, actionName: string): string {
    const PIECE_NAME_PREFIX = 'piece-'
    const idx = connectorName.indexOf(PIECE_NAME_PREFIX)
    const shortPieceName = idx >= 0 ? connectorName.substring(idx + PIECE_NAME_PREFIX.length) : connectorName
    return createToolName(`${shortPieceName}-${actionName}`)
}

export const mcpToolNameUtils = {
    createToolName,
    createPieceToolName,
}
