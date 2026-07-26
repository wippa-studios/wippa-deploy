import {
  createConnector,
  OAuth2PropertyValue,
} from '@wippa/connectors-framework';
import { microsoft365CopilotAuth } from './lib/common/auth';
import { chatWithCopilot } from './lib/actions/chat-with-copilot';
import { searchCopilot } from './lib/actions/search-copilot';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { getGraphBaseUrl, getMicrosoftCloudFromAuth } from './lib/common/microsoft-cloud';

export const microsoft365Copilot = createConnector({
  displayName: 'Microsoft 365 Copilot',
  auth: microsoft365CopilotAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/microsoft-copilot.png',
  authors: ['sanket-a11y'],
  actions: [
    chatWithCopilot,
    searchCopilot,
    // retrieveGroundingData,
    createCustomApiCallAction({
      auth: microsoft365CopilotAuth,
      baseUrl: (auth) => {
        const cloud = getMicrosoftCloudFromAuth(auth as OAuth2PropertyValue);
        return getGraphBaseUrl(cloud) + '/';
      },
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth as OAuth2PropertyValue).access_token}`,
      }),
    }),
  ],
  triggers: [],
});
