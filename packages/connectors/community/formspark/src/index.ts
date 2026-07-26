import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { newSubmissionTrigger } from './lib/triggers/new-submission.trigger';

export const formspark = createConnector({
  displayName: 'Formspark',
  auth: PieceAuth.None(),
  categories: [PieceCategory.FORMS_AND_SURVEYS],
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/formspark.png',
  authors: ['kishanprmr'],
  actions: [],
  triggers: [newSubmissionTrigger],
});
