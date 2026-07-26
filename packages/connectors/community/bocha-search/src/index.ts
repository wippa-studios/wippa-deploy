import { createConnector } from '@wippa/connectors-framework';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceCategory } from '@wippa/connectors-framework';
import { webSearchAction } from './lib/actions/web-search';
import { bochaAuth } from './lib/common/auth';
import { BASE_URL } from './lib/common/client';

export const bocha = createConnector({
  displayName: 'Bocha',
  description:
    'Web search API for AI agents, providing real-time web pages, images, and news.',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/bocha-search.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['BochaLab'],
  auth: bochaAuth,
  actions: [
    webSearchAction,
    createCustomApiCallAction({
      baseUrl: () => BASE_URL,
      auth: bochaAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${auth.secret_text}`,
      }),
    }),
  ],
  triggers: [],
});
