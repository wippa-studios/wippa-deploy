import { PieceAuth } from '@wippa/connectors-framework';

export const chatflyAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Enter your ChatFly API key',
  required: true,
});
