import { createConnector } from '@wippa/connectors-framework';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceCategory } from '@wippa/connectors-framework';
import { klipyAuth } from './lib/common/auth';
import { searchGifsAction } from './lib/actions/search-gifs';
import { searchStickersAction } from './lib/actions/search-stickers';
import { searchClipsAction } from './lib/actions/search-clips';

export const klipy = createConnector({
  displayName: 'Klipy',
  description: 'Search and retrieve GIFs, stickers, and video clips from KLIPY\'s media library.',
  auth: klipyAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/klipy.png',
  categories: [PieceCategory.CONTENT_AND_FILES],
  authors: ['sanket-a11y'],
  actions: [
    searchGifsAction,
    searchStickersAction,
    searchClipsAction,
    createCustomApiCallAction({
      baseUrl: (auth) => `https://api.klipy.com/api/v1/${auth?.secret_text}`,
      auth: klipyAuth,
    }),
  ],
  triggers: [],
});

export { klipyAuth };
