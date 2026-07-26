import { createConnector } from '@wippa/connectors-framework';
import { kudosityAuth } from './lib/common/auth';
import { addUpdateContact } from './lib/actions/add-update-contact';
import { deleteContact } from './lib/actions/delete-contact';
import { cancelSms } from './lib/actions/cancel-sms';
import { formatNumber } from './lib/actions/format-number';
import { sendSms } from './lib/actions/send-sms';
import { getSmsInfo } from './lib/actions/get-sms-info';
import { linkHit } from './lib/triggers/link-hit';
import { smsReceived } from './lib/triggers/sms-received';
import { smsSent } from './lib/triggers/sms-sent';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceCategory } from '@wippa/connectors-framework';

export const kudosity = createConnector({
  displayName: 'Kudosity',
  auth: kudosityAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/kudosity.png',
  authors: ['sanket-a11y'],
  description:
    'Kudosity is a cloud-based SMS platform that enables businesses to send and receive text messages globally.',
  categories: [PieceCategory.COMMUNICATION],
  actions: [
    addUpdateContact,
    deleteContact,
    cancelSms,
    formatNumber,
    sendSms,
    getSmsInfo,
    createCustomApiCallAction({
      auth: kudosityAuth,
      baseUrl: () => 'https://api.transmitsms.com',
      authMapping: async (auth) => {
        return {
          'x-api-key': `${auth.secret_text}`,
        };
      },
    }),
  ],
  triggers: [linkHit, smsReceived, smsSent],
});
