import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { matchPerson } from './lib/actions/match-person';
import { enrichCompany } from './lib/actions/enrich-company';
import { newsArticlesSearch } from './lib/actions/news-articles-search';
import { organizationJobPostings } from './lib/actions/organization-job-postings';
import { organizationSearch } from './lib/actions/organization-search';
import { peopleSearch } from './lib/actions/people-search';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { apolloAuth } from './lib/auth';

export const apollo = createConnector({
  displayName: 'Apollo',
  auth: apolloAuth,
  description:
    'AI sales platform for prospecting, lead gen, and deal automation. Close more deals, faster, with smart data.',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/apollo.png',
  authors: ['abuaboud', 'sanket-a11y'],
  actions: [
    matchPerson,
    enrichCompany,
    newsArticlesSearch,
    organizationJobPostings,
    organizationSearch,
    peopleSearch,
    createCustomApiCallAction({
      auth: apolloAuth,
      baseUrl: () => 'https://api.apollo.io/api/v1',
      authMapping: async (auth) => {
        return {
          'x-api-key': auth.secret_text,
        };
      },
    }),
  ],
  triggers: [],
});
