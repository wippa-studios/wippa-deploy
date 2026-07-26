import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { extractText } from './lib/actions/extract-text';
import { classifyText } from './lib/actions/classify-text';
import { finetuneModel } from './lib/actions/finetune-model';
import { metatextAuth } from './lib/auth';

export const metatext = createConnector({
  displayName: 'Metatext',
  description: 'AI content moderation and safety guard API',
  auth: metatextAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/metatext.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['onyedikachi-david'],
  actions: [extractText, classifyText, finetuneModel],
  triggers: [],
});
