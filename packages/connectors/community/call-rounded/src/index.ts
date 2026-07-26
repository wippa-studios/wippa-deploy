import { createConnector, PieceAuth } from "@wippa/connectors-framework";
import { createCustomApiCallAction } from '@wippa/connectors-common';

export const callRoundedAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'Please enter the API Key obtained from Call Rounded.',
});

export const callRounded = createConnector({
  displayName: "Call-rounded",
  auth: callRoundedAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.activepieces.com/pieces/call-rounded.png",
  authors: ["perrine-pullicino-alan"],
  actions: [
    createCustomApiCallAction({
      baseUrl: () => {
        return "https://api.callrounded.com/v1";
      },
      auth: callRoundedAuth,
      authMapping: async (auth) => ({
        'x-app': 'activepieces',
        'x-api-key': auth.secret_text,
      }),
    })
  ],
    triggers: [],
});
