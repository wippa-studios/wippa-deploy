import { createConnector, PieceAuth } from "@wippa/connectors-framework";
import { respaidActions } from "./lib/actions";
import { respaidTriggers } from "./lib/triggers";
import { respaidAuth } from './lib/auth';

    
export const respaid = createConnector({
  displayName: "Respaid",
  auth: respaidAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.activepieces.com/pieces/respaid.jpg",
  authors: [],
  actions: respaidActions,
  triggers: respaidTriggers,
});
    