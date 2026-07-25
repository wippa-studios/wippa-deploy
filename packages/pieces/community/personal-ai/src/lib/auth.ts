import { PieceAuth } from '@wippa/pieces-framework';

export const personalAiAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'API Key for authentication',
  required: true,
})
