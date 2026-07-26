import { PieceAuth } from '@wippa/pieces-framework';

export const genderApiAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'The API key for accessing the Gender-api service',
  required: true,
});
