import { createConnector } from '@wippa/connectors-framework';
import { moonclerkAuth } from './lib/common/auth';
import { retrivePlan } from './lib/actions/retrive-plan';
import { newPlan } from './lib/triggers/new-plan';
import { paymentSucceeds } from './lib/triggers/payment-succeeds';
import { newPayment } from './lib/triggers/new-payment';
import { planEnded } from './lib/triggers/plan-ended';
import { planPaymentFailed } from './lib/triggers/plan-payment-failed';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceCategory } from '@wippa/connectors-framework';

export const moonclerk = createConnector({
  displayName: 'Moonclerk',
  auth: moonclerkAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/moonclerk.png',
  authors: ['sanket-a11y'],
  description: 'MoonClerk is an easy-to-use payment form builder for Stripe.',
  categories: [PieceCategory.COMMERCE],
  actions: [
    retrivePlan,
    createCustomApiCallAction({
      auth: moonclerkAuth,
      baseUrl: () => 'https://api.moonclerk.com',
      authMapping: async (auth) => {
        return {
          Authorization: `Token token=${auth.secret_text}`,
          Accept: 'application/vnd.moonclerk+json;version=1',
        };
      },
    }),
  ],
  triggers: [
    newPayment,
    newPlan,
    paymentSucceeds,
    planEnded,
    planPaymentFailed,
  ],
});
