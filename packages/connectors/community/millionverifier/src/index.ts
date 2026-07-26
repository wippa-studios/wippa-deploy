import { createConnector } from '@wippa/connectors-framework';
import { millionVerifierAuth } from './lib/common/auth';
import { PieceCategory } from '@wippa/connectors-framework';
import { verifyEmail } from './lib/actions/verify-email';

export const millionverifier = createConnector({
  displayName: 'MillionVerifier',
  auth: millionVerifierAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/millionverifier.png',
  authors: ['sanket-a11y'],
  categories: [PieceCategory.COMMUNICATION],
  description: 'MillionVerifier is an email verifier service and API',
  actions: [verifyEmail],
  triggers: [],
});
