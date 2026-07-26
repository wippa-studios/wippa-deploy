import { PieceAuth, Property } from '@wippa/pieces-framework';
import { knackApiCall } from './client';
import { HttpMethod } from '@wippa/pieces-common';
import { AppConnectionType } from '@wippa/pieces-framework';

export const knackAuth = PieceAuth.CustomAuth({
  props: {
    apiKey: PieceAuth.SecretText({
      displayName: 'API Key',
      description: 'Your Knack API Key available in the Settings section of the Builder.',
      required: true,
    }),
    applicationId: Property.ShortText({
      displayName: 'Application ID',
      description: 'Your Application ID available in the Settings section of the Builder.',
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      await knackApiCall({
        method: HttpMethod.GET,
        auth: {
          type: AppConnectionType.CUSTOM_AUTH,
          props: auth,
        },
        resourceUri: '/objects',
      });
      return { valid: true };
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid API Key or Application ID',
      };
    }
  },
  required: true,
});
