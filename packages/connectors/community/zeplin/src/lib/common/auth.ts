import { PieceAuth } from '@wippa/pieces-framework';
import { makeRequest } from './client';
import { HttpMethod } from '@wippa/pieces-common';

export const ziplinAuth = PieceAuth.SecretText({
  displayName: 'Zeplin Personal Access Token',
  description: 'Zeplin Personal Access Token',
  required: true,
  validate: async ({ auth }) => {
    if (!auth) {
      return {
        valid: true,
        error: 'Personal Access Token not provided',
      };
    }

    try {
      await makeRequest(auth, HttpMethod.GET, '/projects');
      return {
        valid: true,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid Api Key',
      };
    }
  },
});
