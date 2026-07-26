
import { createConnector } from "@wippa/connectors-framework";
import { PieceCategory } from '@wippa/connectors-framework';
import { alttextifyAuth } from "./lib/common/auth";
import { generateAltTextAction } from "./lib/actions/generate-alt-text";
import { createCustomApiCallAction } from "@wippa/connectors-common";

export const alttextify = createConnector({
  displayName: "AltTextify",
  categories: [PieceCategory.PRODUCTIVITY],
  auth: alttextifyAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.activepieces.com/pieces/alttextify.png",
  authors: ['kishanprmr'],
  actions: [generateAltTextAction,
    createCustomApiCallAction({
      auth: alttextifyAuth,
      baseUrl: () => 'https://api.alttextify.net/api/v1',
      authMapping: async (auth) => {
        return {
          'X-API-Key': auth.secret_text
        }
      }
    })
  ],
  triggers: [],
});
