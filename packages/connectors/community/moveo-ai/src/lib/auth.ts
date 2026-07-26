import { PieceAuth } from '@wippa/connectors-framework';

export const moveoAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Generate an API key in Deploy → Developer Tools → API Keys.',
  required: true,
});
