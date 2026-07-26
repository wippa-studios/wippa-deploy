import { HttpMethod, httpClient } from '@wippa/connectors-common';
import { AppConnectionValueForAuthProperty } from '@wippa/connectors-framework';
import { cognitoFormsAuth } from '../auth';

export const BASE_URL = 'https://www.cognitoforms.com/api';

export async function makeRequest(
  {secret_text}: AppConnectionValueForAuthProperty<typeof cognitoFormsAuth>,
  method: HttpMethod,
  path: string,
  body?: unknown
) {
  const response = await httpClient.sendRequest({
    method,
    url: `${BASE_URL}${path}`,
    headers: {
      Authorization: `Bearer ${secret_text}`,
      'Content-Type': 'application/json',
    },
    body,
  });

  return response.body;
}
