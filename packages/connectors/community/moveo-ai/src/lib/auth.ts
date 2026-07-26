import { PieceAuth } from '@wippa/pieces-framework';

export const moveoAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Generate an API key in Deploy → Developer Tools → API Keys.',
  required: true,
});
