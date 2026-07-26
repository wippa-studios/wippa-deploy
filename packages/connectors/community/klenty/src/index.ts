import { createCustomApiCallAction } from '@wippa/connectors-common';
import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';

import { addProspectToCampaignAction } from './lib/actions/add-prospect-to-campaign';
import { createProspectAction } from './lib/actions/create-prospect';
import { getProspectAction } from './lib/actions/get-prospect';
import { updateProspectAction } from './lib/actions/update-prospect';
import { klentyAuth } from './lib/auth';
import { getKlentyBaseUrl } from './lib/common/client';

export const klenty = createConnector({
  displayName: 'Klenty',
  description:
    'Sales engagement platform for managing prospects and adding them to outreach cadences.',
  auth: klentyAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/klenty.png',
  authors: ['Harmatta', 'sanket-a11y'],
  categories: [PieceCategory.SALES_AND_CRM, PieceCategory.MARKETING],
  actions: [
    createProspectAction,
    updateProspectAction,
    getProspectAction,
    addProspectToCampaignAction,
    createCustomApiCallAction({
      auth: klentyAuth,
      baseUrl: (auth) => getKlentyBaseUrl(auth?.props?.username ?? ''),
      authMapping: async (auth) => ({
        'x-API-key': auth.props.apiKey,
        api_key: auth.props.apiKey,
      }),
    }),
  ],
  triggers: [],
});
