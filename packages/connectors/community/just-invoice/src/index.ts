
    import { createConnector, PieceAuth } from "@wippa/connectors-framework";
import { justInvoiceAuth } from "./lib/common/auth";
import * as actions from "./lib/actions/index";

export const justInvoice = createConnector({
  displayName: "JustInvoice",
  description: "Create and manage invoices with JustInvoice API",
  auth: justInvoiceAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.activepieces.com/pieces/just-invoice.png",
  authors: ['onyedikachi-david'],
  actions: [actions.createInvoice, actions.getInvoice, actions.markInvoiceFinal, actions.markInvoiceCancelled, actions.markInvoicePaid, actions.deleteInvoice],
  triggers: [],
});
    
