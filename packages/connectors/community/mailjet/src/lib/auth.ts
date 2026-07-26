import { PieceAuth } from '@wippa/connectors-framework';

export const mailjetAuth = PieceAuth.BasicAuth({
  description: 'Enter your api credentials',
  required: true,
  username: {
    displayName: 'API Key',
    description: 'Enter your API Key here'
  },
  password: {
    displayName: 'API Secret',
    description: 'Enter your API Secret here'
  }
});
