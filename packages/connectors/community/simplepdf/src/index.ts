import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { simplePDFNewSubmission } from './lib/triggers/new-submission';

export const simplepdf = createConnector({
  displayName: 'SimplePDF',
  description: 'PDF editing and generation tool',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/simplepdf.png',
  authors: ["bendersej","kishanprmr","khaledmashaly","abuaboud"],
  categories: [PieceCategory.CONTENT_AND_FILES],
  actions: [],
  triggers: [simplePDFNewSubmission],
});
