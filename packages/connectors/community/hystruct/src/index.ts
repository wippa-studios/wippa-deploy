import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createJob } from './lib/actions/create-job';
import { workflowEvent } from './lib/triggers/workflow-event';
import { hystructAuth } from './lib/auth';

export const hystruct = createConnector({
  displayName: 'Hystruct',
  description: 'AI-powered document structuring and data extraction',
  auth: hystructAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/hystruct.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['onyedikachi-david'],
  actions: [createJob],
  triggers: [workflowEvent],
});
