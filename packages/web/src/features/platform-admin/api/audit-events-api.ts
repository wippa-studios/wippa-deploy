import { SeekPage } from '@wippa/core-utils';
import { ApplicationEvent, ListAuditEventsRequest } from '@wippa/shared';

import { api } from '@/lib/api';

export const auditEventsApi = {
  list(request: ListAuditEventsRequest) {
    return api.get<SeekPage<ApplicationEvent>>('/v1/audit-events', request);
  },
};
