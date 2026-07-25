import { PieceAuth } from '@wippa/pieces-framework';

export const chatflyAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Enter your ChatFly API key',
  required: true,
});
