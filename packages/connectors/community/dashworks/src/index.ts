
import { createConnector } from "@wippa/connectors-framework";
import { PieceCategory } from '@wippa/connectors-framework';
import { generateAnswerAction } from "./lib/actions/generate-answer";
import { createCustomApiCallAction } from "@wippa/connectors-common";
import { dashworksAuth } from "./lib/common/auth";

export const dashworks = createConnector({
  displayName: "Dashworks",
  categories: [PieceCategory.PRODUCTIVITY],
  auth: dashworksAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.activepieces.com/pieces/dashworks.png",
  authors: ["kishanprmr"],
  actions: [generateAnswerAction,
    createCustomApiCallAction({
      auth: dashworksAuth,
      baseUrl: () => 'https://api.dashworks.ai/v1/',
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth.secret_text}`
        }
      }
    })
  ],
  triggers: [],
});
