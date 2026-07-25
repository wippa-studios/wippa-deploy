import { PieceAuth } from '@wippa/pieces-framework';

export const bannerbearAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Bannerbear API Key',
  required: true,
});
