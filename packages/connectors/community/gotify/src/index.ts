import {
  PieceAuth,
  Property,
  createConnector,
} from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { sendNotification } from './lib/actions/send-notification';
import { gotifyAuth } from './lib/auth';

export const gotify = createConnector({
  displayName: 'Gotify',
  description: 'Self-hosted push notification service',

  logoUrl: 'https://cdn.activepieces.com/pieces/gotify.png',
  minimumSupportedRelease: '0.30.0',
  categories: [PieceCategory.DEVELOPER_TOOLS],
  authors: ["MyWay","kishanprmr","khaledmashaly","abuaboud"],
  auth: gotifyAuth,
  actions: [sendNotification],
  triggers: [],
});
