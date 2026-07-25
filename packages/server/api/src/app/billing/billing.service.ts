import { ActivepiecesError, ErrorCode, assertNotNullOrUndefined } from '@wippa/core-utils'
import { FastifyBaseLogger } from 'fastify'
import Stripe from 'stripe'
import { repoFactory } from '../core/db/repo-factory'
import { PlatformPlanEntity } from '../ee/platform/platform-plan/platform-plan.entity'
import { AppSystemProp } from '../helper/system/system-props'
import { system } from '../helper/system/system'

const platformPlanRepo = repoFactory(PlatformPlanEntity)

const MONTHLY_PRICE_ID = system.get(AppSystemProp.STRIPE_MONTHLY_PRICE_ID)

export const billingService = (log: FastifyBaseLogger) => ({
    async createCheckoutSession(platformId: string): Promise<{ url: string }> {
        const stripe = getStripe()
        const plan = await platformPlanRepo().findOneBy({ platformId })
        assertNotNullOrUndefined(plan, 'Platform plan not found')

        let customerId = plan.stripeCustomerId
        if (!customerId) {
            const customer = await stripe.customers.create({
                metadata: { platformId },
            })
            customerId = customer.id
            await platformPlanRepo().update(plan.id, { stripeCustomerId: customerId })
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            line_items: [{
                price: MONTHLY_PRICE_ID ?? '',
                quantity: 1,
            }],
            success_url: `${system.get(AppSystemProp.FRONTEND_URL)}/platform/setup/billing/success`,
            cancel_url: `${system.get(AppSystemProp.FRONTEND_URL)}/platform/setup/billing/error`,
            metadata: { platformId },
        })

        if (!session.url) {
            throw new ActivepiecesError({
                code: ErrorCode.INVALID_APP_CONNECTION,
                params: { error: 'Failed to create checkout session' },
            })
        }

        return { url: session.url }
    },
})

function getStripe(): Stripe {
    const secretKey = system.get(AppSystemProp.STRIPE_SECRET_KEY)
    if (!secretKey) {
        throw new ActivepiecesError({
            code: ErrorCode.INVALID_APP_CONNECTION,
            params: { error: 'Stripe is not configured' },
        })
    }
    return new Stripe(secretKey, { apiVersion: '2025-05-28.basil' as any })
}
