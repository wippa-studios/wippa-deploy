import { PieceAuth } from '@wippa/connectors-framework';

export const braveSearchAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description:
    'Your Brave Search API Key (get it from https://brave.com/search/api/)',
});
