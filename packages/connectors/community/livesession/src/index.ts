import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { livesessionAuth } from './lib/common/auth';
import { sessionEvent } from './lib/triggers/session-event';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceCategory } from '@wippa/connectors-framework';

export const livesession = createConnector({
  displayName: 'LiveSession',
  auth: livesessionAuth,
  minimumSupportedRelease: '0.36.1',
  description:
    'LiveSession is the analytics platform that helps businesses scale up based on data.',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  logoUrl: 'https://cdn.activepieces.com/pieces/livesession.png',
  authors: ['sanket-a11y'],
  actions: [
    createCustomApiCallAction({
      auth: livesessionAuth,
      baseUrl: () => 'https://api.livesession.io/v1',
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth.secret_text}`,
        };
      },
    }),
  ],
  triggers: [sessionEvent],
});
