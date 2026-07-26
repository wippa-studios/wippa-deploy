import { instabaseAuth } from '../auth';
import { AuthenticationType, httpClient, HttpMethod } from '@wippa/connectors-common';
import { AppConnectionValueForAuthProperty } from '@wippa/connectors-framework';



export const createInstabaseHeaders = (auth: AppConnectionValueForAuthProperty<typeof instabaseAuth>): Record<string, string> => {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${auth.props.apiToken}`,
    'Content-Type': 'application/json',
  };

  if (auth.props.ibContext) {
    headers['IB-Context'] = auth.props.ibContext;
  }

  return headers;
};

export const makeInstabaseApiCall = async <T = any>(
  auth: AppConnectionValueForAuthProperty<typeof instabaseAuth>,
  endpoint: string,
  method: HttpMethod = HttpMethod.GET,
  body?: any
): Promise<T> => {
  const url = `${auth.props.apiRoot}${endpoint}`;
  const headers = createInstabaseHeaders(auth);

  const response = await httpClient.sendRequest<T>({
    method,
    url,
    headers,
    body,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: auth.props.apiToken,
    },
  });

  return response.body;
};
