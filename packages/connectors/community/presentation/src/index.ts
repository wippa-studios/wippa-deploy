import { createConnector } from '@wippa/connectors-framework';
import { generatePresentations } from './lib/actions/generate-presentations';

import { presentonAuth } from './lib/common/auth';
import { PieceCategory } from '@wippa/connectors-framework';
import { newPresentation } from './lib/triggers/new-presentation';
import { createCustomApiCallAction } from '@wippa/connectors-common';

export const presentation = createConnector({
  displayName: 'Presenton',
  description:
    'Generate AI-powered presentations using Presenton (https://presenton.ai). Supports templates, themes, images, synchronous and asynchronous generation, status polling, and export to PPTX/PDF.',
  auth: presentonAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/presenton.png',
  categories: [
    PieceCategory.ARTIFICIAL_INTELLIGENCE,
    PieceCategory.CONTENT_AND_FILES,
  ],
  authors: ['sanket-a11y'],
  actions: [
    generatePresentations,
    createCustomApiCallAction({
      auth: presentonAuth,
      baseUrl: () => 'https://api.presenton.ai/api/v1',
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth.secret_text}`,
        };
      },
    }),
  ],
  triggers: [newPresentation],
});
