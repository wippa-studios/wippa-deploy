import { createPiece, PieceAuth } from '@wippa/pieces-framework';
import { captureScreenshot } from './lib/actions/capture-screenshot';
import { PieceCategory } from '@wippa/pieces-framework';
import {
  createCustomApiCallAction,
  httpClient,
  HttpMethod,
} from '@wippa/pieces-common';
import { peekshotAuth } from './lib/auth';

export const peekshot = createPiece({
  displayName: 'PeekShot',
  auth: peekshotAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/peekshot.png',
  categories: [PieceCategory.PRODUCTIVITY],
  authors: ['balwant1707'],
  actions: [
    captureScreenshot,
    createCustomApiCallAction({
      auth: peekshotAuth,
      baseUrl: () => 'https://api.peekshot.com/api/v1',
      authMapping: async (auth) => {
        return {
          'x-api-key': auth.secret_text,
        };
      },
    }),
  ],
  triggers: [],
});
