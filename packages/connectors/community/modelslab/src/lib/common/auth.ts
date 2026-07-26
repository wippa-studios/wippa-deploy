import { PieceAuth } from '@wippa/connectors-framework';

export const modelsLabAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Get your API key at https://modelslab.com/account/api-key',
  required: true,
});
