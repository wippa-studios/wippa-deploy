import { httpClient, HttpMethod, AuthenticationType } from "@wippa/pieces-common";
import { AppConnectionValueForAuthProperty } from "@wippa/pieces-framework";
import { foreplayCoAuth } from "..";

export interface ForeplayCoApiCallProps {
  apiKey: AppConnectionValueForAuthProperty<typeof foreplayCoAuth>;
  method: HttpMethod;
  resourceUri: string;
  queryParams?: Record<string, string>;
  body?: any;
}

export async function foreplayCoApiCall({
  apiKey,
  method,
  resourceUri,
  queryParams,
  body,
}: ForeplayCoApiCallProps) {
  const baseUrl = "https://public.api.foreplay.co";

  return httpClient.sendRequest({
    method,
    url: `${baseUrl}${resourceUri}`,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: apiKey.secret_text,
    },
    queryParams,
    body,
  });
}
