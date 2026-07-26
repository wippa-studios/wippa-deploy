import { createCustomApiCallAction } from '@wippa/connectors-common';
import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createOrUpdateContact } from './lib/actions/create-or-update-contact';
import { findListByName } from './lib/actions/find-list-by-name';
import { sendDynamicTemplate } from './lib/actions/send-dynamic-template';
import { sendEmail } from './lib/actions/send-email';
import { getApiKey, getBaseUrl, sendgridAuth, SendgridAuthValue } from './lib/common';

export { sendgridAuth, SendgridAuthValue } from './lib/common';

export const sendgrid = createConnector({
  displayName: 'SendGrid',
  description:
    'Email delivery service for sending transactional and marketing emails',

  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/sendgrid.png',
  authors: ['ashrafsamhouri', 'kishanprmr', 'MoShizzle', 'khaledmashaly', 'abuaboud', 'Thijs-Attenza', 'sanket-a11y'],
  categories: [PieceCategory.COMMUNICATION, PieceCategory.MARKETING],
  auth: sendgridAuth,
  actions: [
    sendEmail,
    sendDynamicTemplate,
    createOrUpdateContact,
    findListByName,
    createCustomApiCallAction({
      baseUrl: (auth) => getBaseUrl(auth as SendgridAuthValue),
      auth: sendgridAuth,
      authMapping: async (auth) => ({
        Authorization: `Bearer ${getApiKey(auth as SendgridAuthValue)}`,
      }),
    }),
  ],
  triggers: [],
});
