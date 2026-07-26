import { createPiece } from '@wippa/pieces-framework';
import { PieceCategory } from '@wippa/pieces-framework';
import { createCustomApiCallAction } from '@wippa/pieces-common';
import { BASE_URL, cometApiAuth } from './lib/common/auth';
import { askCometApiAction } from './lib/actions/ask-cometapi';

export const cometapi = createPiece({
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
