import {
  AuthenticationType,
  HttpMessageBody,
  HttpMethod,
  HttpResponse,
  httpClient,
} from '@wippa/connectors-common';
import { tidyCalAuth } from '../auth';
import { AppConnectionValueForAuthProperty } from '@wippa/connectors-framework';

export async function calltidycalapi<T extends HttpMessageBody>(
  method: HttpMethod,
  apiUrl: string,
  accessToken: AppConnectionValueForAuthProperty<typeof tidyCalAuth>,
  body: any | undefined
): Promise<HttpResponse<T>> {
  return await httpClient.sendRequest<T>({
    method: method,
    url: `https://tidycal.com/api/${apiUrl}`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: accessToken.secret_text,
    },
    body: body,
  });
}
