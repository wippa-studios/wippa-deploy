import { createCustomApiCallAction } from '@wippa/connectors-common';
import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createDiscountAction } from './lib/actions/create-discount';
import { getDiscountAction } from './lib/actions/get-discount';
import { getAllDiscountsAction } from './lib/actions/get-discounts';
import { getOrderAction } from './lib/actions/get-order';
import { getOrderDateAction } from './lib/actions/get-orders-date';
import { getOrderEmailAction } from './lib/actions/get-orders-date-email';
import { getProductsAction } from './lib/actions/get-products';
import { cartloomAuth } from './lib/auth';

export const cartloom = createConnector({
  displayName: 'Cartloom',
  description: 'Sell products beautifully',
  auth: cartloomAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/cartloom.png',
  categories: [PieceCategory.COMMERCE],
  authors: ["joeworkman","kishanprmr","MoShizzle","abuaboud"],
  actions: [
    getProductsAction,
    getOrderAction,
    createDiscountAction,
    getDiscountAction,
    getAllDiscountsAction,
    getOrderDateAction,
    getOrderEmailAction,
    createCustomApiCallAction({
      baseUrl: (auth) =>
        `https://${auth?.props.domain}.cartloom.com/api`, // Replace with the actual base URL
      auth: cartloomAuth,
      authMapping: async (auth) => ({
        'X-API-KEY': auth.props.apiKey,
      }),
    }),
  ],
  triggers: [],
});
