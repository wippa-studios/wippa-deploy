import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { scanFile } from './lib/actions/scan-file';
import { scanText } from './lib/actions/scan-text';
import { PieceCategory } from '@wippa/connectors-framework';
import { gptzeroDetectAiAuth } from './lib/common/auth';

export const gptzeroDetectAi = createConnector({
  displayName: 'GPTZero',
  auth: gptzeroDetectAiAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/gptzero-detect-ai.png',
  authors: ['sanket-a11y'],
  description: 'Detect AI-generated text with GPTZero API',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  actions: [scanFile, scanText],
  triggers: [],
});
