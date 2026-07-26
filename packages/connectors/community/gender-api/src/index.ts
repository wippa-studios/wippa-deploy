import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { genderApiAuth } from './lib/common/auth';
import { getStatistics } from './lib/actions/get-statistics';
import { getGenderByFullName } from './lib/actions/get-gender-by-full-name';
import { getGenderByFirstName } from './lib/actions/get-gender-by-first-name';
import { createCustomApiCallAction } from '@wippa/connectors-common';

export const genderApi = createConnector({
  displayName: 'Gender API',
  auth: genderApiAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/gender-api.png',
  authors: ['sanket-a11y'],
  description: 'Predict the gender of a person based on their name using Gender-api service.',
  actions: [
    getGenderByFirstName,
    getGenderByFullName,
    getStatistics,
    createCustomApiCallAction({
      auth: genderApiAuth,
      baseUrl: () => 'https://gender-api.com/v2',
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth.secret_text}`,
        };
      },
    }),
  ],
  triggers: [],
});
