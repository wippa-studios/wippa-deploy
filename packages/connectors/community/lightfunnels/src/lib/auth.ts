import { PieceAuth } from '@wippa/connectors-framework';
import { OAuth2GrantType } from '@wippa/connectors-framework';

export const lightfunnelsAuth = PieceAuth.OAuth2({
  grantType: OAuth2GrantType.AUTHORIZATION_CODE,
  authUrl: 'https://app.lightfunnels.com/admin/oauth',
  tokenUrl: 'https://services.lightfunnels.com/oauth/access',
  required: true,
  scope: ['products,orders,customers,funnels'],
});
