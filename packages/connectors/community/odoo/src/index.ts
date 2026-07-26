import {
  createConnector,
  PieceAuth,
  Property,
} from '@wippa/connectors-framework';
import Odoo from './commom/index';
import actions from './lib/actions';
import { odooAuth } from './lib/auth';

export const odoo = createConnector({
  displayName: 'Odoo',
  description: 'Open source all-in-one management software',
  auth: odooAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/odoo.png',
  authors: ["mariomeyer","kishanprmr","abuaboud"],
  actions,
  triggers: [],
});
