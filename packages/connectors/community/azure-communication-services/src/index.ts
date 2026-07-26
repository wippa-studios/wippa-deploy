import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { sendEmail } from './lib/actions/send-email';
import { PieceCategory } from '@wippa/connectors-framework';

export const azureCommunicationServiceAuth = PieceAuth.SecretText({
  displayName: 'Connection string',
  required: true,
});

export const azureCommunicationServices = createConnector({
  displayName: 'Azure Communication Services',
  description: 'Communication services from Microsoft Azure',
  auth: azureCommunicationServiceAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl:
    'https://cdn.activepieces.com/pieces/azure-communication-services.png',
  categories: [PieceCategory.COMMUNICATION, PieceCategory.MARKETING],
  authors: ['matthieu-lombard'],
  actions: [sendEmail],
  triggers: [],
});
