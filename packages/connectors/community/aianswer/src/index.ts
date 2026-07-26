import {
  httpClient,
  createCustomApiCallAction,
  HttpMethod,
} from '@wippa/connectors-common';
import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { aiAnswerConfig } from './lib/common/models';
import { gmailGetListOfAgents } from './lib/actions/gmail-get-list-of-agents';
import { createPhoneCall } from './lib/actions/create-phone-call';
import { getCallDetails } from './lib/actions/get-call-details';
import { scheduleCallAgent } from './lib/actions/schedule-call-agent';
import { PieceCategory } from '@wippa/connectors-framework';
import { getCallTranscript } from './lib/actions/get-call-transcript';
import { aiAnswerAuth } from './lib/auth';

export const aianswer = createConnector({
  displayName: 'AI Answer',
  auth: aiAnswerAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/aianswer.png',
  categories: [
    PieceCategory.COMMUNICATION,
    PieceCategory.CUSTOMER_SUPPORT,
    PieceCategory.ARTIFICIAL_INTELLIGENCE,
  ],
  authors: ['drona2938'],
  actions: [
    gmailGetListOfAgents,
    createPhoneCall,
    getCallDetails,
    scheduleCallAgent,
    getCallTranscript,
    createCustomApiCallAction({
      baseUrl: () => aiAnswerConfig.baseUrl,
      auth: aiAnswerAuth,
      authMapping: async (auth) => ({
        [aiAnswerConfig.accessTokenHeaderKey]: `${auth.secret_text}`,
      }),
    }),
  ],
  triggers: [],
});
