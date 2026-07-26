import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { readConnection } from './lib/actions/read-connection';

export const connections = createConnector({
  displayName: 'Connections',
  description: 'Read connections dynamically',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/new-core/connections.svg',
  categories: [PieceCategory.CORE],
  auth: PieceAuth.None(),
  authors: ["kishanprmr","AbdulTheActivePiecer","khaledmashaly","abuaboud"],
  actions: [readConnection],
  triggers: [],
});
