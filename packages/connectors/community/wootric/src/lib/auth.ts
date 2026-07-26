import { PieceAuth } from '@wippa/connectors-framework';
import { OAuth2GrantType } from '@wippa/connectors-framework';

const WOOTRIC_API_URL = 'https://api.wootric.com';

export { WOOTRIC_API_URL };

export const wootricAuth = PieceAuth.OAuth2({
  required: true,
  grantType: OAuth2GrantType.CLIENT_CREDENTIALS,
  authUrl: '',
  tokenUrl: `${WOOTRIC_API_URL}/oauth/token`,
  scope: [],
});
