import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { bannerbearCreateImageAction } from './lib/actions/create-image';
import { bannerbearAuth } from './lib/auth';

export const bannerbear = createConnector({
  displayName: 'Bannerbear',
  description: 'Automate image generation',

  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/bannerbear.png',
  categories: [PieceCategory.MARKETING],
  authors: ["kishanprmr","MoShizzle","khaledmashaly","abuaboud"],
  auth: bannerbearAuth,
  actions: [
    bannerbearCreateImageAction,
    createCustomApiCallAction({
      baseUrl: () => 'https://sync.api.bannerbear.com/v2',
      auth: bannerbearAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${auth.secret_text}`,
      }),
    }),
  ],
  triggers: [],
});
