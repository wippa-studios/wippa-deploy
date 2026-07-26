import { tryCatch } from '@wippa/core-utils'
import { ApLogger } from '@wippa/server-utils'
import { EngineResponseStatus, FlowTriggerType, FlowVersion, TriggerRunStatus, WorkerToApiContract } from '@wippa/shared'

export async function recordTriggerRun({ apiClient, log, flowVersion, platformId, status }: RecordTriggerRunParams): Promise<void> {
    if (flowVersion.trigger.type !== FlowTriggerType.PIECE) {
        return
    }
    const connectorName = flowVersion.trigger.settings.connectorName
    const triggerRunStatus = status === EngineResponseStatus.OK ? TriggerRunStatus.COMPLETED : TriggerRunStatus.FAILED
    const { error } = await tryCatch(() => apiClient.recordTriggerRun({ platformId, connectorName, status: triggerRunStatus }))
    if (error) {
        log.warn({ error: String(error), piece: { name: connectorName }, flowVersion: { id: flowVersion.id } }, 'Failed to record trigger run stats')
    }
}

type RecordTriggerRunParams = {
    apiClient: WorkerToApiContract
    log: ApLogger
    flowVersion: FlowVersion
    platformId: string
    status: EngineResponseStatus
}
