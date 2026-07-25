import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { billingService } from './billing.service'
import { StatusCodes } from 'http-status-codes'
import { securityAccess } from '../core/security/authorization/fastify-security'
import { PrincipalType } from '@activepieces/shared'

export const billingController: FastifyPluginAsyncZod = async (app) => {
    app.post('/create-checkout-session', async (request, reply) => {
        const platformId = request.principal.platform.id
        const result = await billingService(app.log).createCheckoutSession(platformId)
        return reply.status(StatusCodes.OK).send(result)
    })
}
