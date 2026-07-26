import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { platformMustHaveFeatureEnabled } from '../../authentication/ee-authorization'
import { pieceSetController } from './connector-set.controller'

export const pieceSetModule: FastifyPluginAsyncZod = async (app) => {
    app.addHook('preHandler', platformMustHaveFeatureEnabled((platform) => platform.plan.managePiecesEnabled))
    await app.register(pieceSetController, { prefix: '/v1/piece-sets' })
}
