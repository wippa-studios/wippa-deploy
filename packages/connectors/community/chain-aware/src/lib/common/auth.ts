import { PieceAuth } from '@wippa/connectors-framework';

export const chainAwareAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'Enter your ChainAware API key.',
});
