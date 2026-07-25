import {
    HttpMethod,
    QueryParams,
    httpClient,
    HttpRequest,
} from '@wippa/pieces-common';
import { AppConnectionValueForAuthProperty } from '@wippa/pieces-framework';
import { hunterAuth } from '../auth';

export async function hunterApiCall({
    apiKey,
    endpoint,
    method,
    qparams,
    body,
}: {
    apiKey: AppConnectionValueForAuthProperty<typeof hunterAuth>;
    endpoint: string;
    method: HttpMethod;
    qparams?: QueryParams;
    body?: any;
}) {
    const queryParams: QueryParams = {
        ...(qparams ?? {}),
        api_key: apiKey.secret_text,
    };

    const request: HttpRequest = {
        url: `https://api.hunter.io/v2${endpoint}`,
        method,
        queryParams,
        body,
    };

    const response = await httpClient.sendRequest(request);
    return response.body;
}
