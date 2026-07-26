import { PieceAuth } from '@wippa/connectors-framework';

export const weekdoneAuth = PieceAuth.OAuth2({
  required: true,
  authUrl: 'https://weekdone.com/oauth_authorize',
  tokenUrl: 'https://weekdone.com/oauth_token',
  scope: [],
});
