import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { platformMustHaveFeatureEnabled } from '../../authentication/ee-authorization'
import { connectorSetController } from './connector-set.controller'

export const connectorSetModule: FastifyPluginAsyncZod = async (app) => {
    app.addHook('preHandler', platformMustHaveFeatureEnabled((platform) => platform.plan.managePiecesEnabled))
    await app.register(connectorSetController, { prefix: '/v1/piece-sets' })
}
