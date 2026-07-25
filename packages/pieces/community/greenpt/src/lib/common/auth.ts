import { PieceAuth } from '@wippa/pieces-framework';

export const greenptAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'API Key for Greenpt',
  required: true,
});
