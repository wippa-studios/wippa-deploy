import { createConnector } from '@wippa/connectors-framework';
import { askAvian } from './lib/actions/ask-avian';
import { PieceCategory } from '@wippa/connectors-framework';
import { avianAuth } from './lib/auth';

export const avian = createConnector({
  displayName: 'Avian',
  description: 'Integrate with Avian  to leverage its powerful language models for generating human-like text based on your prompts.',
  auth: avianAuth,
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/avian.png',
  authors: ['avianion'],
  actions: [askAvian],
  triggers: [],
});
