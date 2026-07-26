import { PieceAuth } from '@wippa/connectors-framework';

export const vadooAiAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: `You can create API key from [Profile Settings](https://ai.vadoo.tv/profile).`,
});
