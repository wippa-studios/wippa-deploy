import { PieceAuth } from '@wippa/connectors-framework';
import { makeRequest } from './client';
import { HttpMethod } from '@wippa/connectors-common';

export const presentonAuth = PieceAuth.SecretText({
  displayName: 'Presenton API Key',
  description: `
`,
  required: true,
  validate: async ({ auth }) => {
    if (auth) {
      try {
        await makeRequest(
          auth as string,
          HttpMethod.GET,
          '/ppt/presentation/all',
          {}
        );
        return {
          valid: true,
        };
      } catch (error) {
        return {
          valid: false,
          error: 'Invalid Api Key',
        };
      }
    }
    return {
      valid: false,
      error: 'Invalid Api Key',
    };
  },
});
