import { createConnector } from "@wippa/connectors-framework";
import { PieceCategory } from '@wippa/connectors-framework';
import { clicdataAuth } from "./lib/common/auth";
import { insertRow, refreshTable } from "./lib/actions";

export const clicdata = createConnector({
  displayName: "Clicdata",
  auth: clicdataAuth,
  minimumSupportedRelease: '0.36.1',
  description: "ClicData enables True Performance with an end-to-end data analytics platform: connect, transform, automate, visualize and share data from 300+ sources.",
  logoUrl: "https://cdn.activepieces.com/pieces/clicdata.png",
  categories: [PieceCategory.BUSINESS_INTELLIGENCE],
  authors: ["onyedikachi-david"],
  actions: [insertRow, refreshTable],
  triggers: [],
});
