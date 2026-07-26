import { PieceAuth } from '@wippa/connectors-framework';
import { makeRequest } from './client';
import { HttpMethod } from '@wippa/connectors-common';

export const aircallAuth = PieceAuth.BasicAuth({
  description: `You can create API key by naviagting to **Integrations & API** menu.`,
  required: true,
  username: {
    displayName: 'API ID',
  },
  password: {
    displayName: 'API Token',
  },
  validate: async ({ auth }) => {
    try {
      await makeRequest(auth, HttpMethod.GET, '/ping');

      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Invalid Credentials' };
    }
  },
});
