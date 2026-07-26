import { createCustomApiCallAction } from '@wippa/pieces-common';
import { createPiece } from '@wippa/pieces-framework';
import { PieceCategory } from '@wippa/pieces-framework';

import { tallyAuth } from './lib/auth';
import { TALLY_API_BASE } from './lib/common/client';
import { newSubmissionTrigger } from './lib/triggers/new-submission';

export const tally = createPiece({
	displayName: 'Tally',
	description: 'Receive form submissions from Tally forms',
	auth: tallyAuth,
	minimumSupportedRelease: '0.27.1',
	logoUrl: 'https://cdn.activepieces.com/pieces/tally.png',
	categories: [PieceCategory.FORMS_AND_SURVEYS],
	authors: ['kishanprmr', 'abuaboud', 'bst1n'],
	actions: [
		createCustomApiCallAction({
			auth: tallyAuth,
			baseUrl: () => TALLY_API_BASE,
			authMapping: async (auth) => ({
				Authorization: `Bearer ${auth.secret_text}`,
			}),
		}),
	],
	triggers: [newSubmissionTrigger],
});
