import { createCustomApiCallAction } from '@wippa/connectors-common';
import { buttondownAuth } from '../common/auth';
import { BUTTONDOWN_BASE_URL } from '../common/client';

export const customApiCall = createCustomApiCallAction({
  auth: buttondownAuth,
  baseUrl: () => BUTTONDOWN_BASE_URL,
  authMapping: async (auth) => ({
    Authorization: `Token ${auth.secret_text}`,
  }),
});
