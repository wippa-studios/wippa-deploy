
    import { createConnector, PieceAuth } from "@wippa/connectors-framework";
import { generateAltTextAction } from "./lib/actions/generate-alt-text";
import { createCustomApiCallAction } from "@wippa/connectors-common";
import { altTextAiAuth } from "./lib/common/auth";
import { BASE_URL } from "./lib/common/constants";
import { PieceCategory } from '@wippa/connectors-framework';

    export const altTextAi = createConnector({
      displayName: "AltText.ai",
      categories:[PieceCategory.ARTIFICIAL_INTELLIGENCE],
      auth: altTextAiAuth,
      minimumSupportedRelease: '0.36.1',
      logoUrl: "https://cdn.activepieces.com/pieces/alt-text-ai.png",
      authors: ['kishanprmr'],
      actions: [generateAltTextAction,
        createCustomApiCallAction({
          auth:altTextAiAuth,
          baseUrl:()=>BASE_URL,
          authMapping:async (auth)=>{
            return{
              'X-API-Key':auth.secret_text
            }
          }
        })
      ],
      triggers: [],
    });
    