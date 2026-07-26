import { PieceAuth } from '@wippa/connectors-framework';
import { HttpMethod } from '@wippa/connectors-common';
import { makeReadwiseRequest } from './client';

export const readwiseAuth = PieceAuth.SecretText({
  displayName: 'Access Token',
  description:
    'Your Readwise access token. Get it at https://readwise.io/access_token',
  required: true,
  validate: async ({ auth }) => {
    try {
      await makeReadwiseRequest({
        token: auth,
        method: HttpMethod.GET,
        endpoint: '/auth/',
      });
      return { valid: true };
    } catch (e) {
      return { valid: false, error: 'Invalid Readwise access token.' };
    }
  },
});
