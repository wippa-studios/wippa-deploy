import {
  httpClient,
  HttpMessageBody,
  HttpMethod,
  QueryParams,
} from '@wippa/connectors-common';
import { OAuth2PropertyValue } from '@wippa/connectors-framework';

export const WEEKDONE_BASE_URL = 'https://api.weekdone.com/1';

export type WeekdoneApiCallParams = {
  auth: OAuth2PropertyValue;
  method: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
};

export async function weekdoneApiCall<T extends HttpMessageBody>({
  auth,
  method,
  path,
  query,
  body,
}: WeekdoneApiCallParams): Promise<T> {
  const queryParams: QueryParams = {
    token: auth.access_token,
  };

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        queryParams[key] = String(value);
      }
    }
  }

  const response = await httpClient.sendRequest<T>({
    method,
    url: `${WEEKDONE_BASE_URL}${path}`,
    queryParams,
    body,
  });

  return response.body;
}
