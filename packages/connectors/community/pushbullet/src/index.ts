import {
  createConnector,
  OAuth2PropertyValue,
} from '@wippa/connectors-framework';
import { bushbulletAuth } from './lib/common/auth';
import { sendALink } from './lib/actions/send-a-link';
import { sendANote } from './lib/actions/send-a-note';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { BASE_URL } from './lib/common/client';
import { PieceCategory } from '@wippa/connectors-framework';

export const pushbullet = createConnector({
  displayName: 'Pushbullet',
  description: 'Cross-device notification service',
  categories: [PieceCategory.COMMUNICATION],
  auth: bushbulletAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/pushbullet.png',
  authors: ['sanket-a11y'],
  actions: [
    sendALink,
    sendANote,
    createCustomApiCallAction({
      auth: bushbulletAuth,
      baseUrl: () => BASE_URL,
      authMapping: async (auth) => {
        const access_token = auth;
        return {
          Authorization: `Bearer ${access_token.secret_text}`,
          'Content-Type': 'application/json',
        };
      },
    }),
  ],
  triggers: [],
});
