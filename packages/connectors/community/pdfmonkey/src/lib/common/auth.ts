import { PieceAuth } from '@wippa/connectors-framework';
import { makeRequest } from './client';
import { HttpMethod } from '@wippa/connectors-common';
import { AppConnectionType } from '@wippa/connectors-framework';

export const pdfmonkeyAuth = PieceAuth.SecretText({
	displayName: 'API Key',
	description: `You can obtain your API key by navigating to [Account Settings](https://dashboard.pdfmonkey.io/account).`,
	required: true,
	validate: async ({ auth }) => {
		try {
			await makeRequest({
				type: AppConnectionType.SECRET_TEXT,
				secret_text: auth,
			}, HttpMethod.GET, '/documents', {});
			return {
				valid: true,
			};
		} catch {
			return {
				valid: false,
				error: 'Invalid API Key.',
			};
		}
	},
});
