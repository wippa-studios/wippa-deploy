import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createChatCompletionAction } from './lib/actions/create-chat-completion.action';
import { perplexityAiAuth } from './lib/auth';

export const perplexityAi = createConnector({
  displayName: 'Perplexity AI',
  auth: perplexityAiAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/perplexity-ai.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  description: 'AI powered search engine',
  authors: ['kishanprmr','AbdulTheActivePiecer'],
  actions: [createChatCompletionAction],
  triggers: [],
});
