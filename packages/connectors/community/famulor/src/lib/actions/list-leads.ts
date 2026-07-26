import { createAction } from '@wippa/connectors-framework';
import { propsValidation } from '@wippa/connectors-common';
import { famulorAuth } from '../..';
import { famulorCommon } from '../common';

export const listLeads = createAction({
  auth: famulorAuth,
  name: 'listLeads',
  displayName: 'List Leads',
  description: 'List all leads in your account.',
  audience: 'both',
  aiMetadata: {
    description:
      'Retrieve all leads in the account. Use to enumerate leads or to find a lead\'s ID before updating or assigning it. Read-only and idempotent.',
    idempotent: true,
  },
  props: famulorCommon.listLeadsProperties(),
  async run({ auth, propsValue }) {
    await propsValidation.validateZod(propsValue, famulorCommon.listLeadsSchema);

    return await famulorCommon.listLeads({
      auth: auth.secret_text,
    });
  },
});
