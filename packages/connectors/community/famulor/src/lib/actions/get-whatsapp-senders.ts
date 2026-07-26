import { createAction } from '@wippa/connectors-framework';
import { propsValidation } from '@wippa/connectors-common';
import { famulorAuth } from '../..';
import { famulorCommon } from '../common';

export const getWhatsAppSenders = createAction({
  auth: famulorAuth,
  name: 'getWhatsAppSenders',
  displayName: 'Get WhatsApp Senders',
  description: 'List WhatsApp Business senders linked to your account.',
  audience: 'both',
  aiMetadata: { description: 'List the WhatsApp Business senders connected to the account, optionally filtered to only online senders versus all. Read-only and idempotent. Pick this to discover a valid sender_id before sending a WhatsApp template message.', idempotent: true },
  props: famulorCommon.getWhatsAppSendersProperties(),
  async run({ auth, propsValue }) {
    await propsValidation.validateZod(propsValue, famulorCommon.getWhatsAppSendersSchema);

    return await famulorCommon.getWhatsAppSenders({
      auth: auth.secret_text,
      status: propsValue.status as 'online' | 'all' | undefined,
    });
  },
});
