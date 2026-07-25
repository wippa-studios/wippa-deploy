import { FlowVersion } from '@wippa/shared'
import { flowMigrationUtil } from './flow-migration-util'
import { Migration } from '.'

export const migrateAgentPieceV3: Migration = {
    targetSchemaVersion: '3',
    migrate: async (flowVersion: FlowVersion): Promise<FlowVersion> => {
        const newVersion = flowMigrationUtil.pinPieceToVersion(flowVersion, '@wippa/piece-agent', '0.2.2')
        return {
            ...newVersion,
            schemaVersion: '4',
        }
    },
} 