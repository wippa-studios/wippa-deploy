import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { gravityFormsNewSubmission } from './lib/triggers/new-submission';

export const gravityforms = createConnector({
  displayName: 'Gravity Forms',
  description: 'Build and publish your WordPress forms',

  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.27.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/gravityforms.svg',
  authors: ["Abdallah-Alwarawreh","kishanprmr","MoShizzle","abuaboud"],
  categories: [PieceCategory.FORMS_AND_SURVEYS],
  actions: [],
  triggers: [gravityFormsNewSubmission],
});
