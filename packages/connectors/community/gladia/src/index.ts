import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createTranscription } from './lib/actions/create-transcription';
import { uploadAFile } from './lib/actions/upload-a-file';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { gladiaAuth } from './lib/common/auth';

export const gladia = createConnector({
  displayName: 'Gladia',
  auth: gladiaAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/gladia.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['sanket-a11y'],
  actions: [
    createTranscription,
    uploadAFile,
    createCustomApiCallAction({
      baseUrl: () => `https://api.gladia.io/v2`,
      auth: gladiaAuth,
      authMapping: async (auth) => ({
        'x-gladia-key': auth.secret_text,
      }),
    }),
  ],
  triggers: [],
});
