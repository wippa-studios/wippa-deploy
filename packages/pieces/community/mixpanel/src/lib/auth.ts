import { PieceAuth } from '@wippa/pieces-framework';

export const mixpanelAuth = PieceAuth.SecretText({
  displayName: 'Mixpanel token',
  required: true,
  description: `
      The Mixpanel token associated with your project. You can find your Mixpanel token in the project settings dialog in the Mixpanel app.
    `,
});
