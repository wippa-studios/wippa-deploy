import { PieceAuth } from '@wippa/connectors-framework';

export const skyprepAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Skyprep API Key',
  required: true,
});
