import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { addTag } from './lib/add-tag';

export const tags = createConnector({
  displayName: 'Tags',
  description: 'Add custom tags to your run for filtration',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/new-core/tags.svg',
  categories: [PieceCategory.CORE],
  authors: ["kishanprmr","MoShizzle","abuaboud"],
  actions: [addTag],
  triggers: [],
});
