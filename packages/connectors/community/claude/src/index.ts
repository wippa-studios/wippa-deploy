import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { askClaude } from './lib/actions/send-prompt';
import { baseUrl } from './lib/common/common';
import { PieceCategory } from '@wippa/connectors-framework';
import { extractStructuredDataAction } from './lib/actions/extract-structured-data';
import { claudeAuth } from './lib/auth';

export const claude = createConnector({
  displayName: 'Anthropic Claude',
  auth: claudeAuth,
  minimumSupportedRelease: '0.63.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/claude.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['dennisrongo','kishanprmr'],
  actions: [
    askClaude,
    extractStructuredDataAction,
    createCustomApiCallAction({
      auth: claudeAuth,
      baseUrl: () => baseUrl,
      authMapping: async (auth) => {
        return {
          'x-api-key': `${auth.secret_text}`,
        };
      },
    }),
  ],
  triggers: [],
});
