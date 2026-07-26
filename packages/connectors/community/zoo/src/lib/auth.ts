import { PieceAuth } from '@wippa/connectors-framework';

export const zooAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'Your Zoo API Key (Bearer Token).',
});
