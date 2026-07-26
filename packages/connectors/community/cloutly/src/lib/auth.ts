import { PieceAuth } from '@wippa/connectors-framework';

export const cloutlyAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'Please enter the API Key obtained from Cloutly.',
});
