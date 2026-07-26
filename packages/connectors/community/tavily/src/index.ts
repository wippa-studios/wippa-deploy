import { createCustomApiCallAction } from '@wippa/pieces-common';
import { createPiece } from '@wippa/pieces-framework';
import { PieceCategory } from '@wippa/pieces-framework';
import { searchAction } from './lib/actions/search';
import { extractAction } from './lib/actions/extract';
import { tavilyAuth } from './lib/auth';

export const tavily = createPiece({
	displayName: 'Tavily',
	description: 'Search engine tailored for AI agents.',
	minimumSupportedRelease: '0.30.0',
	logoUrl: 'https://cdn.activepieces.com/pieces/tavily.jpg',
	categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
	authors: ['OsamaHaikal'],
	auth: tavilyAuth,
	actions: [searchAction, extractAction,
		createCustomApiCallAction({
			baseUrl: () => 'https://api.tavily.com',
			auth: tavilyAuth,
			authMapping: async (auth) => ({ Authorization: `Bearer ${auth.secret_text}` }),
		})
	],
	triggers: [],
});
