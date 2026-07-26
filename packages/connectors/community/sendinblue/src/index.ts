import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createOrUpdateContact } from './lib/actions/create-or-update-contact';

export const sendinblueAuth = PieceAuth.SecretText({
  displayName: 'Project API key',
  description: 'Your project API key',
  required: true,
});

export const sendinblue = createConnector({
  displayName: 'Brevo',
  description:
    'Formerly Sendinblue, is a SaaS solution for relationship marketing',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/brevo.png',
  authors: ["kanarelo","BLaidzX","Salem-Alaa","kishanprmr","MoShizzle","khaledmashaly","abuaboud"],
  categories: [PieceCategory.MARKETING],
  auth: sendinblueAuth,
  actions: [
    createOrUpdateContact,
    createCustomApiCallAction({
      baseUrl: () => 'https://api.sendinblue.com/v3',
      auth: sendinblueAuth,
      authMapping: async (auth) => ({
        'api-key': auth.secret_text,
      }),
    }),
  ],
  triggers: [],
});
