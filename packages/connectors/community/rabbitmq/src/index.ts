import { createConnector, PieceAuth, Property } from '@wippa/connectors-framework';
import { messageReceived } from './lib/triggers/message-received';
import { sendMessageToExchange } from './lib/actions/send-message-to-exchange';
import { sendMessageToQueue } from './lib/actions/send-message-to-queue';
import { rabbitmqAuth } from './lib/auth';

export const rabbitmq = createConnector({
  displayName: "RabbitMQ",
  auth: rabbitmqAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: "https://cdn.activepieces.com/pieces/rabbitmq.png",
  authors: [
    "alinperghel"
  ],
  actions: [
    sendMessageToExchange,
    sendMessageToQueue,
  ],
  triggers: [
    messageReceived,
  ],
});
