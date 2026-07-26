import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { sendReviewInvite } from './lib/actions/send-review-invite';
import { PieceCategory } from '@wippa/connectors-framework';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { cloutlyAuth } from './lib/auth';

export const cloutly = createConnector({
  displayName: 'Cloutly',
  description: 'Review Management Tool',
  auth: cloutlyAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/cloutly.svg',
  categories: [PieceCategory.MARKETING],
  authors: ['joshuaheslin'],
  actions: [
    sendReviewInvite,
    createCustomApiCallAction({
      baseUrl: () => {
        return 'https://app.cloutly.com/api/v1';
      },
      auth: cloutlyAuth,
      authMapping: async (auth) => ({
        'x-app': 'activepieces',
        'x-api-key': auth.secret_text,
      }),
    }),
  ],
  triggers: [],
});
