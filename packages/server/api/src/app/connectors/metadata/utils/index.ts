import { ActionBase } from '@wippa/connectors-framework'
import { PieceAudienceFilter, PieceCategory, PieceOrderBy, PieceSortBy, SuggestionType } from '@wippa/shared'
import { FastifyBaseLogger } from 'fastify'
import { PieceMetadataSchema } from '../connector-metadata-entity'
import { connectorSearching } from './connector-searching'
import { connectorSorting } from './connector-sorting'

export const pieceListUtils = (_log: FastifyBaseLogger) => ({
    async sortAndSearchPieces(params: SortAndSearchPiecesParams): Promise<PieceMetadataSchema[]> {
        const sortedPieces = connectorSorting.sortAndOrder(
            params.sortBy,
            params.orderBy,
            params.pieces,
        )

        return connectorSearching.search({
            categories: params.categories,
            searchQuery: params.searchQuery,
            pieces: sortedPieces,
            suggestionType: params.suggestionType,
        })
    },
})

export function filterActionsByAudience(
    actions: Record<string, ActionBase>,
    audience: PieceAudienceFilter | undefined,
): Record<string, ActionBase> {
    return Object.fromEntries(
        Object.entries(actions).filter(([, action]) => {
            switch (audience) {
                case PieceAudienceFilter.ALL:
                    return true
                case PieceAudienceFilter.AI:
                    return action.audience !== 'human'
                case PieceAudienceFilter.HUMAN:
                case undefined:
                default:                                
                    return action.audience !== 'ai'
            }
            
        }),
    )
}

export type SortAndSearchPiecesParams = {
    searchQuery?: string
    categories?: PieceCategory[]
    sortBy?: PieceSortBy
    orderBy?: PieceOrderBy
    pieces: PieceMetadataSchema[]
    suggestionType?: SuggestionType
}

export * from './connector-cache-utils'
