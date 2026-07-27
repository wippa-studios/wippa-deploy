import {
    FlowActionType,
    flowStructureUtil,
    FlowVersion,
} from '@wippa/shared'
import { Migration } from '.'


export const migrateV10AiPiecesProviderId: Migration = {
    targetSchemaVersion: '10',
    migrate: async (flowVersion: FlowVersion): Promise<FlowVersion> => {
        const newVersion = flowStructureUtil.transferFlow(flowVersion, (step) => {
            if (step.type !== FlowActionType.PIECE) {
                return step
            }
            if ((step.settings as any).pieceName !== '@wippa/piece-ai' || !['0.0.1', '0.0.2'].includes((step.settings as any).pieceVersion)) {
                return step
            }

            const input = step.settings?.input as Record<string, unknown>

            return {
                ...step,
                settings: {
                    ...step.settings,
                    pieceName: ('@wippa/piece-ai') as any,
                    pieceVersion: ('0.0.4') as any,
                    input,
                },
            }
        })

        return {
            ...newVersion,
            schemaVersion: '11',
        }
    },
}


