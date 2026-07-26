import { PieceAuth } from '@wippa/connectors-framework';

export const smsmodeAuth = PieceAuth.SecretText({
  displayName: 'Smsmode API Key',
  description: 'Smsmode API Key is required to authenticate requests',
  required: true,
});
