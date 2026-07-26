import { PieceAuth } from '@wippa/connectors-framework';

export const runwayAuth = PieceAuth.SecretText({
	displayName: 'API Key',
	description: 'Your Runway API key. Get it from your Runway account settings.',
	required: true,
});


