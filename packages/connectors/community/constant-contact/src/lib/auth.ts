import { PieceAuth } from '@wippa/connectors-framework';

export const constantContactAuth = PieceAuth.OAuth2({
  required: true,
  tokenUrl: 'https://authz.constantcontact.com/oauth2/default/v1/token',
  authUrl: 'https://authz.constantcontact.com/oauth2/default/v1/authorize',
  scope: ['contact_data'],
});
