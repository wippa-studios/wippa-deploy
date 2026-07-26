import { PieceAuth } from '@wippa/connectors-framework';
import { HttpMethod } from '@wippa/connectors-common';
import { makeRequest } from './common';

const markdownDescription = `Obtain your API key from [Valyu Platform](https://platform.valyu.ai/user/account/apikeys).`;

export const valyuAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: markdownDescription,
  required: true,
  validate: async ({ auth }) => {
    try {
      await makeRequest(auth, HttpMethod.GET, '/v1/datasources');
      return {
        valid: true,
      };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid API Key.',
      };
    }
  },
});
