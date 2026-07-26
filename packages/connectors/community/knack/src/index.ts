import { createCustomApiCallAction } from '@wippa/connectors-common';
import { createConnector } from '@wippa/connectors-framework';
import { knackAuth } from './lib/common/auth';
import { createRecordAction } from './lib/actions/create-record';
import { deleteRecordAction } from './lib/actions/delete-record';
import { findRecordAction } from './lib/actions/find-record';
import { updateRecordAction } from './lib/actions/update-record';
import { PieceCategory } from '@wippa/connectors-framework';

export const knack = createConnector({
  displayName: 'Knack',
  auth: knackAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/knack.png',
  categories:[PieceCategory.CONTENT_AND_FILES],
  authors: ['aryel780'],
  actions: [
    createRecordAction,
    deleteRecordAction,
    findRecordAction,
    updateRecordAction,
    createCustomApiCallAction({
      auth: knackAuth,
      baseUrl: () => 'https://api.knack.com/v1',
      authMapping: async (auth) => {
        const { apiKey, applicationId } = auth.props;
        return {
          'X-Knack-Application-ID': applicationId,
          'X-Knack-REST-API-Key': apiKey,
        };
      },
    }),
  ],
  triggers: [],
});
