import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { createCredential } from './lib/actions/create-credential';
import { certopusCommon } from './lib/common';
import { certopusAuth } from './lib/auth';

export const certopus = createConnector({
  displayName: 'Certopus',
  description: 'Your certificates, made simple',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/certopus.png',
  categories: [],
  authors: ["VrajGohil","kishanprmr","MoShizzle","khaledmashaly","abuaboud"],
  auth: certopusAuth,
  actions: [
    createCredential,
    createCustomApiCallAction({
      baseUrl: () => certopusCommon.baseUrl, // Replace with the actual base URL
      auth: certopusAuth,
      authMapping: async (auth) => ({
        'x-api-key': `${auth}`,
      }),
    }),
  ],
  triggers: [],
});
