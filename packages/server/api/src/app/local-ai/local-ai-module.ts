import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { localAiController } from './local-ai-controller'

export const localAiModule: FastifyPluginAsyncZod = async (app) => {
    await app.register(localAiController, { prefix: '/v1/local-ai' })
}
