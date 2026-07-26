import { createConnector } from "@wippa/connectors-framework";
import { PieceCategory } from '@wippa/connectors-framework';
import { baremetricsAuth } from "./lib/common/auth";
import { createCustomer } from "./lib/actions/create-customer";
import { createPlan } from "./lib/actions/create-plan";
import { createSubscription } from "./lib/actions/create-subscription";
import { updateCustomer } from "./lib/actions/update-customer";

export const baremetrics = createConnector({
  displayName: "Baremetrics",
  description: "Analytics and metrics platform for subscription businesses. Create customers, plans, and subscriptions to track your revenue and customer data.",
  categories: [PieceCategory.COMMERCE],
  auth: baremetricsAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cdn.activepieces.com/pieces/baremetrics.png",
  authors: ['onyedikachi-david'],
  actions: [createCustomer, createPlan, createSubscription, updateCustomer],
  triggers: [],
});