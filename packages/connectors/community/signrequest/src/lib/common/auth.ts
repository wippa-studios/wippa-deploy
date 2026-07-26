import { PieceAuth } from '@wippa/pieces-framework';

export const signrequestAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Signrequest API Key',
  required: true,
});
