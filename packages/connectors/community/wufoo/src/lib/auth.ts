import { PieceAuth } from '@wippa/connectors-framework';
import { HttpMethod } from '@wippa/connectors-common';
import { AppConnectionType } from '@wippa/connectors-framework';
import { wufooApiCall } from './common/client';

export const wufooAuth = PieceAuth.CustomAuth({
  description: 'Enter your Wufoo API Key and Subdomain.',
  props: {
    apiKey: PieceAuth.SecretText({
      displayName: 'API Key',
      required: true,
    }),
    subdomain: PieceAuth.SecretText({
      displayName: 'Subdomain',
      description:
        'Your Wufoo account subdomain (e.g., for fishbowl.wufoo.com, use "fishbowl")',
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      await wufooApiCall({
        method: HttpMethod.GET,
        auth: {
          props: auth,
          type: AppConnectionType.CUSTOM_AUTH,
        },
        resourceUri: '/forms.json',
      });
      return { valid: true };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid API Key or Subdomain',
      };
    }
  },
  required: true,
});
