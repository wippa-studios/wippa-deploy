import { ActivepiecesError, ErrorCode, isNil, ProjectId } from '@wippa/core-utils'
import { TriggerBase } from '@wippa/connectors-framework'
import { FlowTriggerType, FlowVersion } from '@wippa/shared'
import { FastifyBaseLogger } from 'fastify'
import { pieceMetadataService } from '../../connectors/metadata/connector-metadata-service'
import { projectService } from '../../project/project-service'

export const triggerUtils = (log: FastifyBaseLogger) => ({
    async getPieceTriggerOrThrow({ flowVersion, projectId }: GetPieceTriggerOrThrowParams): Promise<TriggerBase> {

        const connectorTrigger = await this.getPieceTrigger({
            flowVersion,
            projectId,

        })
        if (isNil(connectorTrigger)) {
            throw new ActivepiecesError({
                code: ErrorCode.ENTITY_NOT_FOUND,
                params: {
                    entityType: 'piece_trigger',
                    entityId: flowVersion.trigger.settings.triggerName,
                    message: `Trigger not found for piece ${flowVersion.trigger.settings.connectorName}@${flowVersion.trigger.settings.connectorVersion}`,
                    extra: {
                        connectorName: flowVersion.trigger.settings.connectorName,
                        connectorVersion: flowVersion.trigger.settings.connectorVersion,
                        triggerName: flowVersion.trigger.settings.triggerName,
                    },
                },
            })
        }
        return connectorTrigger
    },
    async getPieceTrigger({ flowVersion, projectId }: GetPieceTriggerOrThrowParams): Promise<TriggerBase | null> {
        if (flowVersion.trigger.type !== FlowTriggerType.PIECE) {
            return null
        }
        const { connectorName, connectorVersion, triggerName } = flowVersion.trigger.settings
        if (isNil(triggerName)) {
            return null
        }
        return this.getPieceTriggerByName({
            connectorName,
            connectorVersion,
            triggerName,
            projectId,
        })
    },
    async getPieceTriggerByName({ connectorName, connectorVersion, triggerName, projectId }: GetPieceTriggerByNameParams): Promise<TriggerBase | null> {
        const platformId = await projectService(log).getPlatformId(projectId)
        const piece = await pieceMetadataService(log).get({
            platformId,
            name: connectorName,
            version: connectorVersion,
        })
        if (isNil(piece) || isNil(triggerName)) {
            return null
        }
        const connectorTrigger = piece.triggers[triggerName]
        return connectorTrigger
    },
})

type GetPieceTriggerByNameParams = {
    connectorName: string
    connectorVersion: string
    triggerName: string
    projectId: ProjectId
}

type GetPieceTriggerOrThrowParams = {
    flowVersion: FlowVersion
    projectId: ProjectId
}