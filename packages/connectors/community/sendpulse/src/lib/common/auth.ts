import { PieceAuth } from '@wippa/connectors-framework';
import { sendpulseApiCall } from './client';
import { HttpMethod } from '@wippa/connectors-common';

export const sendpulseAuth = PieceAuth.CustomAuth({
  description: 'Enter your SendPulse client credentials',
  props: {
    clientId: PieceAuth.SecretText({
      displayName: 'Client ID',
      required: true,
    }),
    clientSecret: PieceAuth.SecretText({
      displayName: 'Client Secret',
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      await sendpulseApiCall({
        method: HttpMethod.GET,
        resourceUri: '/addressbooks',
        auth,
      });
      return { valid: true };
    } catch {
      return {
        valid: false,
        error: 'Invalid Client ID or Client Secret',
      };
    }
  },
  required: true,
});
