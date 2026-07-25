import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { billingController } from './billing.controller'

export const billingModule: FastifyPluginAsyncZod = async (app) => {
    await app.register(billingController, { prefix: '/v1/billing' })
}
