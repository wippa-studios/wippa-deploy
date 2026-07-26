
import { createConnector, PieceAuth } from "@wippa/connectors-framework";
import { query } from "./lib/actions/query";
import { PieceCategory } from "@wippa/connectors-framework";
    
    export const graphql = createConnector({
      displayName: "GraphQL",
      auth: PieceAuth.None(),
      minimumSupportedRelease: '0.30.0',
      logoUrl: "https://cdn.activepieces.com/pieces/graphql.svg",
      categories:[PieceCategory.CORE],
      authors: ['mahmuthamet'],
      actions: [query],
      triggers: [],
    });
    