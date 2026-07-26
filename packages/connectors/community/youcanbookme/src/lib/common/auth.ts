import { PieceAuth } from '@wippa/connectors-framework';

export const youcanbookmeAuth = PieceAuth.SecretText({
  displayName: 'YouCanBookMe API Key',
  description: `
 Go to [app.youcanbookme.com](https://app.youcanbook.me/#/account/security/)
`,
  required: true,
});
