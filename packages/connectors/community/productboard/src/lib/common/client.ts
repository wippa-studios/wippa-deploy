import { httpClient, HttpMethod } from '@wippa/connectors-common';
import { AppConnectionValueForAuthProperty } from '@wippa/connectors-framework';
import { productboardAuth } from './auth';

const PRODUCTBOARD_API_BASE_URL = 'https://api.productboard.com';

export const productboardCommon = {
    baseUrl: PRODUCTBOARD_API_BASE_URL,

    async apiCall({
        auth,
        method,
        resourceUri,
        body = undefined,
        queryParams = undefined,
    }: {
        auth: AppConnectionValueForAuthProperty<typeof productboardAuth>;
        method: HttpMethod;
        resourceUri: string;
        body?: any;
        queryParams?: Record<string, string>;
    }) {
        return await httpClient.sendRequest({
            method: method,
            url: `${PRODUCTBOARD_API_BASE_URL}${resourceUri}`,
            body,
            queryParams,
            headers: {
                'Authorization': `Bearer ${auth.secret_text}`,
                'X-Version': '1',
                'Content-Type': 'application/json',
            }
        });
    }
};
