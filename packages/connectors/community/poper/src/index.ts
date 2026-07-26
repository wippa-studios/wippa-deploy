import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { newLead } from './lib/triggers/new-lead';
import { PieceCategory } from '@wippa/connectors-framework';

export const poper = createConnector({
  displayName: 'Poper',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.30.0',
  categories: [PieceCategory.MARKETING],
  description:
    'AI Driven Pop-up Builder that can convert visitors into customers,increase subscriber count, and skyrocket sales.',
  logoUrl: 'https://cdn.activepieces.com/pieces/poper.png',
  authors: ['thirstycode'],
  actions: [],
  triggers: [newLead],
});
