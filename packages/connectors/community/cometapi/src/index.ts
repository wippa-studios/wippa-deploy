import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { BASE_URL, cometApiAuth } from './lib/common/auth';
import { askCometApiAction } from './lib/actions/ask-cometapi';

export const cometapi = createConnector({
  displayName: 'CometAPI',
  description:
    'Access multiple AI models through CometAPI - unified interface for GPT, Claude, Gemini, and more.',
  auth: cometApiAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/cometapi.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['TensorNull'],
  actions: [
    askCometApiAction,
    createCustomApiCallAction({
      baseUrl: () => BASE_URL,
      auth: cometApiAuth,
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth.secret_text}`,
        };
      },
    }),
  ],
  triggers: [],
});
