import { isNil } from '@wippa/core-utils'
import { WebhookRenewStrategy } from '@wippa/connectors-framework'
import { LATEST_JOB_DATA_SCHEMA_VERSION, TriggerSourceScheduleType, TriggerStrategy, WorkerJobType } from '@wippa/shared'
import { FastifyBaseLogger } from 'fastify'
import { IsNull } from 'typeorm'
import { pieceMetadataService } from '../../pieces/metadata/piece-metadata-service'
import { projectService } from '../../project/project-service'
import { triggerSourceRepo } from '../../trigger/trigger-source/trigger-source-service'
import { jobQueue, JobType } from '../job-queue/job-queue'

export const refillRenewWebhookJobs = (log: FastifyBaseLogger) => ({
    async run(): Promise<void> {
        const triggerSources = await triggerSourceRepo().find({
            where: {
                deleted: IsNull(),
                simulate: false,
                type: TriggerStrategy.WEBHOOK,
            },
        })
        let migratedRenewWebhookJobs = 0

        const batchSize = 100
        for (let i = 0; i < triggerSources.length; i += batchSize) {
            const batch = triggerSources.slice(i, i + batchSize)
            await Promise.all(batch.map(async (triggerSource) => {
                const connectorMetadata = await pieceMetadataService(log).get({
                    name: triggerSource.connectorName,
                    version: triggerSource.connectorVersion,
                    platformId: await projectService(log).getPlatformId(triggerSource.projectId),
                })
                const connectorTrigger = connectorMetadata?.triggers?.[triggerSource.triggerName]
                if (isNil(connectorTrigger) || isNil(connectorTrigger.renewConfiguration) || connectorTrigger.renewConfiguration.strategy !== WebhookRenewStrategy.CRON) {
                    return
                }
                await jobQueue(log).add({
                    id: triggerSource.flowVersionId,
                    type: JobType.REPEATING,
                    data: {
                        projectId: triggerSource.projectId,
                        platformId: await projectService(log).getPlatformId(triggerSource.projectId),
                        schemaVersion: LATEST_JOB_DATA_SCHEMA_VERSION,
                        flowVersionId: triggerSource.flowVersionId,
                        flowId: triggerSource.flowId,
                        jobType: WorkerJobType.RENEW_WEBHOOK,
                    },
                    scheduleOptions: {
                        type: TriggerSourceScheduleType.CRON_EXPRESSION,
                        cronExpression: connectorTrigger.renewConfiguration.cronExpression,
                        timezone: 'UTC',
                    },
                })
                migratedRenewWebhookJobs++
            }))
        }

        log.info({
            migratedRenewWebhookJobs,
        }, '[renewWebhookJobsMigration] Migrated renew webhook jobs')
    },
})