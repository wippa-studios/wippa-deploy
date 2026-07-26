import { createCustomApiCallAction } from '@wippa/connectors-common';
import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { blandAiAuth, BLAND_AI_BASE_URL } from './lib/auth';
import { sendCall } from './lib/actions/send-call';
import { getCallDetails } from './lib/actions/get-call-details';
import { listCalls } from './lib/actions/list-calls';

export const blandAi = createConnector({
  displayName: 'Bland AI',
  description: 'AI phone calling platform for outbound and conversational voice workflows.',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/bland-ai.png',
  categories: [PieceCategory.COMMUNICATION],
  auth: blandAiAuth,
  authors: ['Harmatta'],
  actions: [
    sendCall,
    getCallDetails,
    listCalls,
    createCustomApiCallAction({
      auth: blandAiAuth,
      baseUrl: () => BLAND_AI_BASE_URL,
      authMapping: async (auth) => ({
        authorization: auth.secret_text,
      }),
    }),
  ],
  triggers: [],
});
