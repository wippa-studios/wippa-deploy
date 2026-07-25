import { GetSampleDataRequest } from '@wippa/shared';

import { api } from '@/lib/api';

export const sampleDataApi = {
  get(request: GetSampleDataRequest) {
    return api.get<unknown>(`/v1/sample-data`, request);
  },
};
