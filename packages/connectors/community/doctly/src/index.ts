import { createConnector } from '@wippa/connectors-framework';
import { doctlyAuth } from './lib/common/auth';
import { PieceCategory } from '@wippa/connectors-framework';
import { convertPdfToTextAction } from './lib/actions/convert-pdf-to-text';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { BASE_URL } from './lib/common/constants';

export const doctly = createConnector({
	displayName: 'Doctly AI',
	auth: doctlyAuth,
	minimumSupportedRelease: '0.36.1',
	logoUrl: 'https://cdn.activepieces.com/pieces/doctly.png',
	categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
	authors: ['kishanprmr'],
	actions: [
		convertPdfToTextAction,
		createCustomApiCallAction({
			auth: doctlyAuth,
			baseUrl: () => BASE_URL,
			authMapping: async (auth) => {
				return {
					Authorization: `Bearer ${auth.secret_text}`,
				};
			},
		}),
	],
	triggers: [],
});
