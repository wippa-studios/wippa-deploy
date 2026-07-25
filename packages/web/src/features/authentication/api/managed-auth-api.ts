import {
  ManagedAuthnRequestBody,
  AuthenticationResponse,
} from '@wippa/shared';

import { api } from '@/lib/api';

export const managedAuthApi = {
  generateApToken: async (request: ManagedAuthnRequestBody) => {
    return api.post<AuthenticationResponse>(
      `/v1/managed-authn/external-token`,
      request,
    );
  },
};
