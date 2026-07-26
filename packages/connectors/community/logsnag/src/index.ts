import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { createEvent } from './lib/actions/create-event';
import { newEventCreated } from './lib/triggers/new-event-created';
import { createCustomApiCallAction } from '@wippa/connectors-common';

export const logsnagAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  required: true,
  description: 'Your LogSnag API key specific to the project',
});

export const logsnag = createConnector({
  displayName: 'LogSnag',
  auth: logsnagAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/logsnag.png',
  authors: [],
  actions: [
    createEvent,
    createCustomApiCallAction({
      auth: logsnagAuth,
      baseUrl: () => 'https://api.logsnag.com/v1',
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth.secret_text}`,
        };
      },
    }),
  ],
  triggers: [newEventCreated],
});
