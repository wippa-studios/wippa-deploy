
import { createConnector } from "@wippa/connectors-framework";
import { promptAgentAction } from "./lib/actions/prompt-agent";
import { uploadAgentFileAction } from "./lib/actions/upload-agent-file";
import { createCustomApiCallAction } from "@wippa/connectors-common";
import { raiaAiAuth } from "./lib/common/auth";
import { BASE_URL } from "./lib/common/constants";

export const raiaAi = createConnector({
  displayName: "raia",
  auth: raiaAiAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.activepieces.com/pieces/raia-ai.png",
  authors: ["kishanprmr"],
  actions: [promptAgentAction, uploadAgentFileAction,
    createCustomApiCallAction({
      auth: raiaAiAuth,
      baseUrl: () => BASE_URL,
      authMapping: async (auth) => {
        return {
          'Agent-Secret-Key': auth.secret_text
        }
      }
    })
  ],
  triggers: [],
});
