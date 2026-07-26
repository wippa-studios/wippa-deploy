import { PieceAuth } from '@wippa/connectors-framework';

export const mollieAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Enter your Mollie API key (starts with live_ or test_)',
  required: true,
});
