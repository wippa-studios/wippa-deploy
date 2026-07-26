import {
  PieceAuth,
  Property,
  createConnector,
} from '@wippa/connectors-framework';

import { PieceCategory } from '@wippa/connectors-framework';
import actions from './lib/actions';
import triggers from './lib/triggers';
import { clockodoAuth } from './lib/auth';

export const clockodo = createConnector({
  displayName: 'Clockodo',
  description: 'Time tracking made easy',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/clockodo.png',
  categories: [PieceCategory.PRODUCTIVITY],
  authors: ["JanHolger","kishanprmr","MoShizzle","khaledmashaly","abuaboud"],
  auth: clockodoAuth,
  actions,
  triggers,
});
