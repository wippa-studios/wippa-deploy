import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { queryAgentAction } from './lib/actions/query-agent';
import { queryDatastoretAction } from './lib/actions/query-datastore';
import { uploadFileAction } from './lib/actions/upload-file';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { chaindeskAuth } from './lib/common/auth';
import { BASE_URL } from './lib/common/constants';

export const chaindesk = createConnector({
  displayName: 'Chaindesk',
  auth: chaindeskAuth,
  minimumSupportedRelease: '0.36.1',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  logoUrl: 'https://cdn.activepieces.com/pieces/chaindesk.png',
  authors: ['kishanprmr'],
  actions: [
    queryAgentAction,
    queryDatastoretAction,
    uploadFileAction,
    createCustomApiCallAction({
      auth: chaindeskAuth,
      baseUrl: () => BASE_URL,
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth.secret_text}`,
        };
      },
    }),
  ],
  triggers: [],
});
