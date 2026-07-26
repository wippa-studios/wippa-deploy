import { createConnector, PieceAuth, Property } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createCustomApiCallAction, httpClient, HttpMethod } from '@wippa/connectors-common';
import { createRecord } from './lib/actions/create-record';
import { updateRecord } from './lib/actions/update-record';
import { deleteRecord } from './lib/actions/delete-record';
import { findRecord } from './lib/actions/find-record';
import { findOrCreateRecord } from './lib/actions/find-or-create-record';
import { createUpdateRecordsBulk } from './lib/actions/create-update-records-bulk';
import { newRecord } from './lib/triggers/new-record';
import { newOrUpdatedRecord } from './lib/triggers/new-or-updated-record';
import { quickbaseAuth } from './lib/auth';

export const quickbase = createConnector({
  displayName: 'Quickbase',
  auth: quickbaseAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/quickbase.png',
  categories: [PieceCategory.PRODUCTIVITY],
  authors: ['sparkybug','sanket-a11y'],
  actions: [
    createRecord,
    updateRecord,
    deleteRecord,
    findRecord,
    findOrCreateRecord,
    createUpdateRecordsBulk,
    createCustomApiCallAction({
      auth: quickbaseAuth,
      baseUrl: (auth) => {
        return `https://api.quickbase.com/v1`;
      },
      authMapping: async (auth) => {
        return {
          'QB-Realm-Hostname': (auth).props.realmHostname,
          'Authorization': `QB-USER-TOKEN ${(auth).props.userToken}`,
          'Content-Type': 'application/json',
        };
      },
    })
  ],
  triggers: [newRecord, newOrUpdatedRecord],
});
