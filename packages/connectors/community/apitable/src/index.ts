import { createCustomApiCallAction } from '@wippa/connectors-common';
import {
  createConnector,
  PieceAuth,
  PiecePropValueSchema,
  Property,
} from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createRecordAction } from './lib/actions/create-record';
import { findRecordAction } from './lib/actions/find-record';
import { updateRecordAction } from './lib/actions/update-record';
import { newRecordTrigger } from './lib/triggers/new-record';
import { makeClient } from './lib/common';
import { APITableAuth } from './lib/auth';

export const apitable = createConnector({
  displayName: 'AITable',
  auth: APITableAuth,
  description: `Interactive spreadsheets with collaboration`,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/apitable.png',
  categories: [PieceCategory.PRODUCTIVITY],
  authors: [
    'alerdenisov',
    'Abdallah-Alwarawreh',
    'kishanprmr',
    'MoShizzle',
    'abuaboud',
  ],
  actions: [
    createRecordAction,
    updateRecordAction,
    findRecordAction,
    createCustomApiCallAction({
      baseUrl: (auth) => {
        return (auth?.props.apiTableUrl ?? '');
      },
      auth: APITableAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth?.props.token ?? '')}`,
      }),
    }),
  ],
  triggers: [newRecordTrigger],
});
