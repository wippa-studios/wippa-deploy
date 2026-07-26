import { createConnector } from '@wippa/connectors-framework';
import { dataFuelAuth } from './lib/common/auth';
import { crawlWebsiteAction } from './lib/actions/crawl-website';
import { scrapeWebsiteAction } from './lib/actions/scrape-website';
import { getScrapeAction } from './lib/actions/get-scrape-result';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { BASE_URL } from './lib/common/constants';

export const datafuel = createConnector({
	displayName: 'DataFuel',
	auth: dataFuelAuth,
	minimumSupportedRelease: '0.36.1',
	logoUrl: 'https://cdn.activepieces.com/pieces/datafuel.png',
	authors: ['kishanprmr'],
	actions: [
		crawlWebsiteAction,
		scrapeWebsiteAction,
		getScrapeAction,
		createCustomApiCallAction({
			auth: dataFuelAuth,
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
