import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { sendEmail } from './lib/actions/send-email';
import { mailjetAuth } from './lib/auth';

export const mailjet = createConnector({
  displayName: 'Mailjet',
  description: 'Email delivery service for sending transactional and marketing emails',
  auth: mailjetAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/mailjet.svg',
  categories: [PieceCategory.COMMUNICATION],
  authors: ['christian-schab'],
  actions: [sendEmail],
  triggers: []
});
