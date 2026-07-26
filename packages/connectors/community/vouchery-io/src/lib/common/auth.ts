import { PieceAuth } from '@wippa/connectors-framework';

export const voucheryIoAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Vouchery-io API Key',
  required: true,
});
