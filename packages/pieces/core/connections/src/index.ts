import { PieceAuth, createPiece } from '@wippa/pieces-framework';
import { PieceCategory } from '@wippa/pieces-framework';
import { readConnection } from './lib/actions/read-connection';

export const connections = createPiece({
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
