import { createConnector } from '@wippa/connectors-framework';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceCategory } from '@wippa/connectors-framework';
import { rendexAuth } from './lib/common/auth';
import { RENDEX_BASE_URL } from './lib/common/common';
import { renderToImage } from './lib/actions/render-to-image';

export const rendex = createConnector({
  displayName: 'Rendex',
  description:
    'Render raw HTML, a URL, or Markdown to a PNG, JPEG, or WebP image or a PDF via the Rendex API.',
  auth: rendexAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/rendex.png',
  categories: [PieceCategory.CONTENT_AND_FILES, PieceCategory.DEVELOPER_TOOLS],
  authors: ['Dan425953'],
  actions: [
    renderToImage,
    createCustomApiCallAction({
      baseUrl: () => RENDEX_BASE_URL,
      auth: rendexAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${auth.secret_text}`,
      }),
    }),
  ],
  triggers: [],
});

export { rendexAuth };
