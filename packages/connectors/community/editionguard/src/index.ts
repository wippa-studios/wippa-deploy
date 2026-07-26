import { createConnector } from '@wippa/connectors-framework';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceCategory } from '@wippa/connectors-framework';
import { editionguardAuth } from './lib/common/auth';
import { sendEbookDownloadLinks } from './lib/actions/send-ebook-download-links';

export const editionguard = createConnector({
  displayName: 'EditionGuard',
  description:
    'Secure eBook DRM and fulfillment — protect and deliver EPUB, MOBI, and PDF files with Adobe DRM, Readium LCP, or Social DRM.',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/editionguard.png',
  categories: [PieceCategory.CONTENT_AND_FILES],
  auth: editionguardAuth,
  authors: ['sanket-a11y'],
  actions: [
    sendEbookDownloadLinks,
    createCustomApiCallAction({
      baseUrl: () => 'https://app.editionguard.com/api/v2',
      auth: editionguardAuth,
      authMapping: async (auth) => ({
        Authorization: `token ${auth.secret_text}`,
      }),
    }),
  ],
  triggers: [],
});
