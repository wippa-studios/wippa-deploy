import { Permission } from '@wippa/core-utils';

import { authenticationSession } from './authentication-session';

export const routesThatRequireProjectId = {
  runs: '/runs',
  singleRun: '/runs/:runId',
  flows: '/flows',
  singleFlow: '/flows/:flowId',
  automations: '/automations',
  connections: '/connections',
  singleConnection: '/connections/:connectionId',
  variables: '/variables',
  tables: '/tables',
  singleTable: '/tables/:tableId',
  settings: '/settings',
  releases: '/releases',
  singleRelease: '/releases/:releaseId',
  templates: '/templates',
  singleTemplate: '/templates/:templateId',
};

export const CHAT_ROUTE = '/chat';

export const determineDefaultRoute = ({
  chatEnabled,
}: {
  chatEnabled?: boolean;
}) => {
  if (chatEnabled) {
    return CHAT_ROUTE;
  }
  return authenticationSession.appendProjectRoutePrefix('/templates');
};

export const NEW_FLOW_QUERY_PARAM = 'newFlow';
export const NEW_TABLE_QUERY_PARAM = 'newTable';
