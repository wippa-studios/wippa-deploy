import { PieceAuth } from '@wippa/pieces-framework';

export const mailercheckAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Mailercheck API Key',
  required: true,
});
