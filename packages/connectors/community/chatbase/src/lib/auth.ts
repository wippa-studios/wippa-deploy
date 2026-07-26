import { PieceAuth } from '@wippa/connectors-framework';

const markdownDescription = `You can get your API key from your [Chatbase Account](https://www.chatbase.co/dashboard).`;

export const chatbaseAuth = PieceAuth.SecretText({
	displayName: 'API Key',
	description: markdownDescription,
	required: true,
});
