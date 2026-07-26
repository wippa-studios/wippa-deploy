import { PieceAuth } from '@wippa/connectors-framework';

export const respaidAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'You can find API Key in your Respaid account',
});
