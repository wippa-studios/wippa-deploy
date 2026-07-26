import { createCustomApiCallAction } from '@wippa/connectors-common';
import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { raindropAuth } from './lib/auth';
import { createRaindropAction } from './lib/actions/create-raindrop';
import { getRaindropAction } from './lib/actions/get-raindrop';
import { updateRaindropAction } from './lib/actions/update-raindrop';
import { deleteRaindropAction } from './lib/actions/delete-raindrop';
import { findRaindropsAction } from './lib/actions/find-raindrops';
export { raindropAuth };

export const raindrop = createConnector({
  displayName: 'Raindrop',
  description:
    'Bookmark manager to save, search, and organize content from the web',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/raindrop.png',
  categories: [PieceCategory.PRODUCTIVITY, PieceCategory.CONTENT_AND_FILES],
  auth: raindropAuth,
  authors: ['bs1tn'],
  actions: [
    createRaindropAction,
    getRaindropAction,
    updateRaindropAction,
    deleteRaindropAction,
    findRaindropsAction,
    createCustomApiCallAction({
      baseUrl: () => 'https://api.raindrop.io/rest/v1',
      auth: raindropAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${auth.access_token}`,
      }),
    }),
  ],
  triggers: [],
});
