import { assertEqual, isNil } from '@wippa/core-utils'
import { ConnectorPropertyMap, SetScheduleRequest, StaticPropsValue, TriggerStrategy } from '@wippa/connectors-framework'
import { AUTHENTICATION_PROPERTY_NAME, EngineGenericError, EventPayload, ExecuteTriggerResponse, FlowTrigger, InvalidCronExpressionError, InvalidScheduleIntervalError, PieceTrigger, PropertySettings, ScheduleOptions, TriggerHookType, TriggerSourceScheduleType } from '@wippa/shared'
import { isValidCron } from 'cron-validator'
import { EngineConstants, ResolvedExecuteTriggerOperation } from '../handler/context/engine-constants'
import { FlowExecutorContext } from '../handler/context/flow-execution-context'
import { createFileUploader } from '../connector-context/file-uploader'
import { createFlowsContext } from '../connector-context/flows'
import { createContextStore } from '../connector-context/store'
import { utils } from '../utils'
import { propsProcessor } from '../variables/props-processor'
import { createPropsResolver } from '../variables/props-resolver'
import { connectorLoader } from './connector-loader'

type Listener = {
    events: string[]
    identifierValue: string
    identifierKey: string
}

export const triggerHelper = {
    async executeOnStart(trigger: FlowTrigger, constants: EngineConstants, payload: unknown) {
        const { connectorName, connectorVersion, triggerName, input, propertySettings } = (trigger as PieceTrigger).settings

        if (isNil(triggerName)) {
            throw new EngineGenericError('TriggerNameNotSetError', 'Trigger name is not set')
        }

        const { connectorTrigger, processedInput, piece } = await prepareTriggerExecution({
            connectorName,
            connectorVersion,
            triggerName,
            input,
            projectId: constants.projectId,
            apiUrl: constants.internalApiUrl,
            engineToken: constants.engineToken,
            devPieces: constants.devPieces,
            propertySettings,
            stepNames: constants.stepNames,
        })
        const isOldVersionOrNotSupported = isNil(connectorTrigger.onStart)
        if (isOldVersionOrNotSupported) {
            return
        }
        const context = {
            store: createContextStore({
                apiUrl: constants.internalApiUrl,
                prefix: '',
                flowId: constants.flowId,
                engineToken: constants.engineToken,
            }),
            auth: processedInput[AUTHENTICATION_PROPERTY_NAME],
            propsValue: processedInput,
            payload,
            run: {
                id: constants.flowRunId,
            },
            step: {
                name: triggerName,
            },
            project: {
                id: constants.projectId,
                externalId: constants.externalProjectId,
            },
            connections: utils.createConnectionManager({
                apiUrl: constants.internalApiUrl,
                projectId: constants.projectId,
                engineToken: constants.engineToken,
                target: 'triggers',
                contextVersion: piece.getContextInfo?.().version,
            }),
        }
        await connectorTrigger.onStart(context)
    },

    async executeTrigger({ params, constants }: ExecuteTriggerParams): Promise<ExecuteTriggerResponse<TriggerHookType>> {
        const { connectorName, connectorVersion, triggerName, input, propertySettings } = (params.flowVersion.trigger as PieceTrigger).settings

        if (isNil(triggerName)) {
            throw new EngineGenericError('TriggerNameNotSetError', 'Trigger name is not set')
        }

        const { piece, connectorTrigger, processedInput } = await prepareTriggerExecution({
            connectorName,
            connectorVersion,
            triggerName,
            input,
            projectId: params.projectId,
            apiUrl: constants.internalApiUrl,
            engineToken: params.engineToken,
            devPieces: constants.devPieces,
            propertySettings,
            stepNames: constants.stepNames,
        })

        const appListeners: Listener[] = []
        const prefix = params.test ? 'test' : ''
        let scheduleOptions: ScheduleOptions | undefined = undefined
        const context = {
            store: createContextStore({
                apiUrl: constants.internalApiUrl,
                prefix,
                flowId: params.flowVersion.flowId,
                engineToken: params.engineToken,
            }),
            step: {
                name: triggerName,
            },
            app: {
                createListeners({ events, identifierKey, identifierValue }: Listener): void {
                    appListeners.push({ events, identifierValue, identifierKey })
                },
            },
            setSchedule(request: SetScheduleRequest) {
                if ('intervalMs' in request) {
                    const parsed = ScheduleOptions.safeParse({
                        type: TriggerSourceScheduleType.INTERVAL,
                        intervalMs: request.intervalMs,
                    })
                    if (!parsed.success) {
                        throw new InvalidScheduleIntervalError(request.intervalMs)
                    }
                    scheduleOptions = parsed.data
                    return
                }
                if (!isValidCron(request.cronExpression)) {
                    throw new InvalidCronExpressionError(request.cronExpression)
                }
                scheduleOptions = {
                    type: TriggerSourceScheduleType.CRON_EXPRESSION,
                    cronExpression: request.cronExpression,
                    timezone: request.timezone ?? 'UTC',
                }
            },
            flows: createFlowsContext({
                engineToken: params.engineToken,
                internalApiUrl: constants.internalApiUrl,
                flowId: params.flowVersion.flowId,
                flowVersionId: params.flowVersion.id,
            }),
            webhookUrl: params.webhookUrl,
            auth: processedInput[AUTHENTICATION_PROPERTY_NAME],
            propsValue: processedInput,
            payload: params.triggerPayload ?? {},
            project: {
                id: params.projectId,
                externalId: constants.externalProjectId,
            },
            server: {
                token: params.engineToken,
                apiUrl: constants.internalApiUrl,
                publicUrl: params.publicApiUrl,
            },
            connections: utils.createConnectionManager({
                apiUrl: constants.internalApiUrl,
                projectId: constants.projectId,
                engineToken: constants.engineToken,
                target: 'triggers',
                contextVersion: piece.getContextInfo?.().version,
            }),
        }
        switch (params.hookType) {
            case TriggerHookType.ON_DISABLE: {
                await connectorTrigger.onDisable(context)
                return {}
            }
            case TriggerHookType.ON_ENABLE: {
                await connectorTrigger.onEnable(context)
                return {
                    listeners: appListeners,
                    scheduleOptions: connectorTrigger.type === TriggerStrategy.POLLING ? scheduleOptions : undefined,
                }
            }
            case TriggerHookType.RENEW: {
                assertEqual(connectorTrigger.type, TriggerStrategy.WEBHOOK, 'triggerType', 'WEBHOOK')
                await connectorTrigger.onRenew(context)
                return {}
            }
            case TriggerHookType.HANDSHAKE: {
                const { data: handshakeResponse, error: handshakeResponseError } = await utils.tryCatchAndThrowOnEngineError(() => connectorTrigger.onHandshake(context))

                if (handshakeResponseError) {
                    throw handshakeResponseError
                }
                return {
                    response: handshakeResponse,
                }
            }
            case TriggerHookType.TEST: {
                const { data: testResponse, error: testResponseError } = await utils.tryCatchAndThrowOnEngineError(() => connectorTrigger.test({
                    ...context,
                    files: createFileUploader({
                        apiUrl: constants.internalApiUrl,
                        engineToken: params.engineToken!,
                    }),
                }))

                if (testResponseError) {
                    throw testResponseError
                }
                return {
                    output: testResponse,
                }
            }
            case TriggerHookType.RUN: {
                if (connectorTrigger.type === TriggerStrategy.APP_WEBHOOK) {

                    const { data: verified, error: verifiedError } = await utils.tryCatchAndThrowOnEngineError(async () => {
                        if (!params.appWebhookUrl) {
                            throw new EngineGenericError('AppWebhookUrlNotAvailableError', `App webhook url is not available for piece name ${connectorName}`)
                        }
                        if (!params.webhookSecret) {
                            throw new EngineGenericError('WebhookSecretNotAvailableError', `Webhook secret is not available for piece name ${connectorName}`)
                        }

                        return piece.events?.verify({
                            appWebhookUrl: params.appWebhookUrl,
                            payload: params.triggerPayload as EventPayload,
                            webhookSecret: params.webhookSecret,
                        })
                    })

                    if (verifiedError) {
                        throw verifiedError
                    }
                    if (isNil(verified)) {
                        throw new Error('Webhook is not verified')
                    }
                }

                const { data: triggerRunResult, error: triggerRunError } = await utils.tryCatchAndThrowOnEngineError(async () => {
                    const items = await connectorTrigger.run({
                        ...context,
                        files: createFileUploader({
                            apiUrl: constants.internalApiUrl,
                            engineToken: params.engineToken!,
                        }),
                    })
                    return {
                        output: items,
                    }
                })

                if (triggerRunError) {
                    throw triggerRunError
                }
                return triggerRunResult
            }
        }
    },
}

type ExecuteTriggerParams = {
    params: ResolvedExecuteTriggerOperation<TriggerHookType>
    constants: EngineConstants
}

async function prepareTriggerExecution({ connectorName, connectorVersion, triggerName, input, propertySettings, projectId, apiUrl, engineToken, devPieces, stepNames }: PrepareTriggerExecutionParams) {
    const { piece, connectorTrigger } = await connectorLoader.getPieceAndTriggerOrThrow({
        connectorName,
        connectorVersion,
        triggerName,
        devPieces,
    })

    const { resolvedInput } = await createPropsResolver({
        apiUrl,
        projectId,
        engineToken,
        contextVersion: piece.getContextInfo?.().version,
        stepNames,
    }).resolve<StaticPropsValue<ConnectorPropertyMap>>({
        unresolvedInput: input,
        executionState: FlowExecutorContext.empty(),
    })

    const { processedInput, errors } = await propsProcessor.applyProcessorsAndValidators(resolvedInput, connectorTrigger.props, piece.auth, connectorTrigger.requireAuth, propertySettings)

    if (Object.keys(errors).length > 0) {
        throw new Error(JSON.stringify(errors, null, 2))
    }

    return { piece, connectorTrigger, processedInput }
}

type PrepareTriggerExecutionParams = {
    connectorName: string
    connectorVersion: string
    triggerName: string
    input: unknown
    propertySettings: Record<string, PropertySettings>
    projectId: string
    apiUrl: string
    engineToken: string
    devPieces: string[]
    stepNames: string[]
}
