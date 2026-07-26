import { createCustomApiCallAction } from '@wippa/connectors-common';
import {
  createConnector,
  OAuth2PropertyValue,
  PieceAuth,
} from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createIssueAction } from './lib/actions/create-issue-action';
import { issuesEventTrigger } from './lib/trigger/issue-event';
import { gitlabAuth } from './lib/auth';

export const gitlab = createConnector({
  displayName: 'GitLab',
  description: 'Collaboration tool for developers',

  auth: gitlabAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/gitlab.png',
  categories: [PieceCategory.DEVELOPER_TOOLS],
  authors: ["kishanprmr","MoShizzle","khaledmashaly","abuaboud"],
  actions: [
    createIssueAction,
    createCustomApiCallAction({
      baseUrl: () => 'https://gitlab.com/api/v4',
      auth: gitlabAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${(auth).access_token}`,
      }),
    }),
  ],
  triggers: [issuesEventTrigger],
});
