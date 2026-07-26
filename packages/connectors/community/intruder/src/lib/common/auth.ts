import { PieceAuth } from '@wippa/connectors-framework';
import { makeRequest } from './client';
import { HttpMethod } from '@wippa/connectors-common';

export const intruderAuth = PieceAuth.SecretText({
  displayName: 'Intruder API Key',
  description: 'API Key for Intruder. Get it from your Intruder account.',
  required: true,
  validate: async ({ auth }) => {
    try {
      await makeRequest(auth, HttpMethod.GET, '/health');
      return {
        valid: true,
      };
    } catch (err) {
      return {
        valid: false,
        error:
          'Connection failed. Please check your credentials and try again.',
      };
    }
  },
});
