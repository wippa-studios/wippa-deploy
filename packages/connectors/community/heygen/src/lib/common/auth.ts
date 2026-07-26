import { HttpMethod } from '@wippa/connectors-common';
import { PieceAuth } from '@wippa/connectors-framework';
import { heygenApiCall } from './client';

export const heygenAuth = PieceAuth.SecretText({
	displayName: 'API Key',
	description: `You can obtain your API key by navigating to your Space Settings in HeyGen App.`,
	required: true,
	validate: async ({ auth }) => {
		try {
			await heygenApiCall({
				apiKey: auth as string,
				method: HttpMethod.GET,
				resourceUri: '/user/me',
				apiVersion: 'v1',
			});
			return { valid: true };
		} catch {
			return {
				valid: false,
				error: 'Invalid API Key.',
			};
		}
	},
});
