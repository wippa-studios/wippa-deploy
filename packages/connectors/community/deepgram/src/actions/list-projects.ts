import { createAction } from '@wippa/connectors-framework';
import { deepgramAuth } from '../common/auth';
import { httpClient, HttpMethod } from '@wippa/connectors-common';
import { BASE_URL } from '../common/constants';

export const listProjectsAction = createAction({
  auth: deepgramAuth,
  name: 'list_projects',
  displayName: 'List Projects',
  description: 'Retrieves a list of all projects associated with the account.',
  audience: 'both',
  aiMetadata: {
    description:
      'Fetches all Deepgram projects accessible to the authenticated API key, with no inputs or filters. Use it to discover project IDs before project-scoped operations or to verify account access. Read-only and safe to call repeatedly.',
    idempotent: true,
  },
  props: {},
  async run(context) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: BASE_URL + '/projects',
      headers: {
        Authorization: `Token ${context.auth.secret_text}`,
      },
    });

    return response.body;
  },
});
