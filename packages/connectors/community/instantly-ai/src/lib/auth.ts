import { PieceAuth } from '@wippa/pieces-framework';

const markdownDescription = `
You can obtain an API key from **Settings->Integrations->API Keys**.
`;

export const instantlyAiAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: markdownDescription,
  required: true,
})
