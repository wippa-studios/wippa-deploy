import { createCustomApiCallAction } from '@wippa/connectors-common';
import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { addAnnotationAction } from './lib/actions/add-annotation';
import { matomoAuth } from './lib/auth';

export const matomo = createConnector({
  displayName: 'Matomo',
  description: 'Open source alternative to Google Analytics',

  auth: matomoAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/matomo.png',
  categories: [PieceCategory.BUSINESS_INTELLIGENCE],
  authors: ["joeworkman","kishanprmr","MoShizzle","abuaboud"],
  actions: [
    addAnnotationAction,
    createCustomApiCallAction({
      baseUrl: (auth) => (auth?.props .domain ?? ''),
      auth: matomoAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth ).props .tokenAuth}`,
      }),
    }),
  ],
  triggers: [],
});

// Matomo API Docs: https://developer.matomo.org/api-reference/reporting-api
