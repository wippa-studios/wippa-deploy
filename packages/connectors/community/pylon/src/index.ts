
import { createConnector, PieceAuth } from "@wippa/connectors-framework";
import { createCustomApiCallAction } from '@wippa/connectors-common';

const auth = PieceAuth.SecretText({
  displayName: "API Key",
  required: true,
})
export const pylon = createConnector({
  displayName: "Pylon",
  auth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.activepieces.com/pieces/pylon.png",
  authors: [],
  actions: [
    createCustomApiCallAction({
      auth: auth,
      baseUrl: () => 'https://api.usepylon.com',
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth.secret_text}`,
        };
      },
    })
  ],
  triggers: [],
});
