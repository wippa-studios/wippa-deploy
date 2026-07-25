import { PieceAuth } from '@wippa/pieces-framework';

export const rapidTextAiAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: `You can obtain your API key from [Dashboard Settings](app.rapidtextai.com).`,
  required: true,
});
