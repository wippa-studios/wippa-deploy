import { PieceAuth } from '@wippa/connectors-framework';

export const metatextAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Contact support@metatext.io to get your API key.',
  required: true,
});
