import { createPiece } from '@wippa/pieces-framework';
import { PieceCategory } from '@wippa/pieces-framework';
import { createCustomApiCallAction } from '@wippa/pieces-common';
import { detectingAiAuth, BASE_URL } from './lib/common';
import { detectAiContent } from './lib/actions/detect-ai-content';
import { checkPlagiarism } from './lib/actions/check-plagiarism';
import { humanizeText } from './lib/actions/humanize-text';

export const detectingAi = createPiece({
  displayName: 'DETECTING-AI.COM',
  auth: detectingAiAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/detecting-ai.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['onyedikachi-david'],
  actions: [
    detectAiContent,
    checkPlagiarism,
    humanizeText,
    createCustomApiCallAction({
      auth: detectingAiAuth,
      baseUrl: () => BASE_URL,
      authMapping: async (auth) => {
        return {
          'X-API-Key': auth.secret_text,
        };
      },
    }),
  ],
  triggers: [],
});
    