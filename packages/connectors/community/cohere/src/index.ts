import { createConnector } from '@wippa/connectors-framework';
import { generateText } from './lib/actions/generate-text';
import { cohereAuth } from './lib/auth';
import { createCustomApiCallAction } from '@wippa/connectors-common';

export const cohere = createConnector({
  displayName: 'Cohere',
  description: 'Generate text using Cohere AI language models',
  auth: cohereAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl:
    'https://cdn.activepieces.com/pieces/cohere.png',
  authors: ['AhmadTash'],
  actions: [generateText,
    createCustomApiCallAction({
      auth: cohereAuth,
      baseUrl: () => 'https://api.cohere.com/v2',
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth!.secret_text}`,
        };
      },
    })
  ],
  triggers: [],
});
