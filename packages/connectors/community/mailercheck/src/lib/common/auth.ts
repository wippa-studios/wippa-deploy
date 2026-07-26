import { PieceAuth } from '@wippa/connectors-framework';

export const mailercheckAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Mailercheck API Key',
  required: true,
});
