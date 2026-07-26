import { PieceAuth } from '@wippa/connectors-framework';

export const signrequestAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Signrequest API Key',
  required: true,
});
