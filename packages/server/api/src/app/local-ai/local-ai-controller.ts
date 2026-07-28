import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { localAiService } from './local-ai-service'

const CHAT_REQUEST = {
    schema: {
        body: z.object({
            messages: z.array(z.object({
                role: z.enum(['system', 'user', 'assistant']),
                content: z.string(),
            })),
        }),
    },
}

const NL_TO_FLOW_REQUEST = {
    schema: {
        body: z.object({
            description: z.string().min(1).max(2000),
        }),
    },
}

const DIAGNOSE_REQUEST = {
    schema: {
        body: z.object({
            stepName: z.string().min(1),
            errorMessage: z.string().min(1),
            flowName: z.string().min(1),
        }),
    },
}

const AVAILABLE_RESPONSE = {
    schema: {
        response: {
            [StatusCodes.OK]: z.object({
                available: z.boolean(),
                model: z.string(),
            }),
        },
    },
}

export const localAiController: FastifyPluginAsyncZod = async (app) => {

    app.get('/available', AVAILABLE_RESPONSE, async () => {
        const svc = localAiService(app.log)
        const available = await svc.isAvailable()
        return { available, model: available ? 'gemma3:1b' : 'none' }
    })

    app.post('/chat', CHAT_REQUEST, async (request, reply) => {
        const svc = localAiService(app.log)
        const content = await svc.chatCompletion({ messages: request.body.messages })
        return reply.status(StatusCodes.OK).send({ content })
    })

    app.post('/nl-to-flow', NL_TO_FLOW_REQUEST, async (request, reply) => {
        const svc = localAiService(app.log)
        const result = await svc.generateFlowFromNl({
            description: request.body.description,
        })
        return reply.status(StatusCodes.OK).send(result)
    })

    app.post('/diagnose', DIAGNOSE_REQUEST, async (request, reply) => {
        const svc = localAiService(app.log)
        const result = await svc.diagnoseError({
            stepName: request.body.stepName,
            errorMessage: request.body.errorMessage,
            flowName: request.body.flowName,
        })
        return reply.status(StatusCodes.OK).send(result)
    })
}
