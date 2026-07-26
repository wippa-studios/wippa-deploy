import { PieceAuth } from '@wippa/connectors-framework';
import { HttpMethod, httpClient } from '@wippa/connectors-common';

export const manusAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Your Manus API key from https://app.manus.ai/settings/api-keys',
  required: true,
  validate: async ({ auth }) => {
    try {
      await httpClient.sendRequest({
        url: 'https://api.manus.ai/v1/tasks',
        method: HttpMethod.POST,
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'API_KEY': auth as string,
        },
        body: {
          prompt: 'test',
          mode: 'speed'
        },
      });
      return {
        valid: true,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid API key',
      };
    }
  },
});
