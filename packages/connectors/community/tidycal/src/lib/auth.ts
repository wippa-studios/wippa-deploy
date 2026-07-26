import { PieceAuth } from '@wippa/connectors-framework';
import { HttpMethod } from '@wippa/connectors-common';
import { AppConnectionType } from '@wippa/connectors-framework';
import { calltidycalapi } from './common';

const markdown = `
# Personal Access Token
1- Visit https://tidycal.com/integrations/oauth and click on "Create a new token"
2- Enter a name for your token and click on "Create"
`;

export const tidyCalAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: markdown,
  required: true,
  validate: async ({ auth }) => {
    try {
      await calltidycalapi(HttpMethod.GET, 'bookings', {
        type: AppConnectionType.SECRET_TEXT,
        secret_text: auth,
      }, undefined);
      return {
        valid: true,
      };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid API Key',
      };
    }
  },
});
