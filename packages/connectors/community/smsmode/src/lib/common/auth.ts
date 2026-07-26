import { PieceAuth } from '@wippa/pieces-framework';

export const smsmodeAuth = PieceAuth.SecretText({
  displayName: 'Smsmode API Key',
  description: 'Smsmode API Key is required to authenticate requests',
  required: true,
});
