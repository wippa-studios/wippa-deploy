import { PieceAuth } from '@wippa/connectors-framework';

export const flipandoAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Flipando API Key',
  required: true,
});
