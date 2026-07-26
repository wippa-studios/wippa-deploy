import { createPiece } from '@wippa/pieces-framework';
import { esignaturesAuth } from './lib/common/auth';
import { PieceCategory } from '@wippa/pieces-framework';
import { createContract } from './lib/actions/create-contract';
import { createCustomApiCallAction } from '@wippa/pieces-common';

export const esignatures = createPiece({
  displayName: 'eSignatures',
  auth: esignaturesAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/esignatures.png',
  authors: ['sanket-a11y'],
  categories: [PieceCategory.SALES_AND_CRM],
  actions: [
    createContract,
    createCustomApiCallAction({
      baseUrl: () => `https://esignatures.com/api`,
      authLocation: 'queryParams',
      auth: esignaturesAuth,
      authMapping: async (auth) => {
        return {
          token: `${auth.secret_text}`,
        };
      },
    }),
  ],
  triggers: [],
});
