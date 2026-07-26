import { PieceAuth } from '@wippa/connectors-framework';
import { httpClient, HttpMethod } from '@wippa/connectors-common';
import { beamerCommon } from './common';

export const beamerAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'API key acquired from your Beamer settings',
  validate: async ({ auth }) => {
    try {
      await httpClient.sendRequest({
        method: HttpMethod.GET,
        url: `${beamerCommon.baseUrl}/ping`,
        headers: {
          'Beamer-Api-Key': `${auth}`,
        },
      })
      return {
        valid: true,
      };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid API key.',
      };
    }
  },
});
