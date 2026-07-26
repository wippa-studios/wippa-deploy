import { createCustomApiCallAction } from '@wippa/connectors-common';
import {
  createConnector,
  PieceAuth,
  Property,
} from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { moxieCreateClientAction } from './lib/actions/create-client';
import { moxieCreateProjectAction } from './lib/actions/create-project';
import { moxieCreateTaskAction } from './lib/actions/create-task';
import { moxieCRMTriggers } from './lib/triggers';
import { moxieCRMAuth } from './lib/auth';
export const moxieCrm = createConnector({
  displayName: 'Moxie',
  description: 'CRM build for the freelancers.',

  auth: moxieCRMAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/moxie-crm.png',
  authors: ["kishanprmr","MoShizzle","abuaboud"],
  categories: [PieceCategory.SALES_AND_CRM],
  actions: [
    moxieCreateClientAction,
    moxieCreateTaskAction,
    moxieCreateProjectAction,
    createCustomApiCallAction({
      baseUrl: (auth) => (auth?.props.baseUrl ?? ''),
      auth: moxieCRMAuth,
      authMapping: async (auth) => ({
        'X-API-KEY': (auth.props.apiKey),
      }),
    }),
  ],
  triggers: moxieCRMTriggers,
});
