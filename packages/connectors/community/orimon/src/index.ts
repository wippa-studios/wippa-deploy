import { createConnector } from '@wippa/connectors-framework';
import { orimonAuth } from './lib/common/auth';
import { sendMessage } from './lib/actions/send-message';
import { newLead } from './lib/triggers/new-lead';
import { createCustomApiCallAction } from '@wippa/connectors-common';

export const orimon = createConnector({
  displayName: 'Orimon',
  auth: orimonAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/orimon.png',
  authors: ['sanket-a11y'],
  actions: [
    sendMessage,
    createCustomApiCallAction({
      auth: orimonAuth,
      baseUrl: () => 'https://channel-connector.orimon.ai/orimon/v1',
      authMapping: async (auth) => ({
        authorization: `apiKey ${auth.secret_text}`,
      }),
    }),
  ],
  triggers: [newLead],
});
