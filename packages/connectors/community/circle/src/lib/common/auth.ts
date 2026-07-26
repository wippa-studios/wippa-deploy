import { PieceAuth } from "@wippa/connectors-framework";

export const circleAuth = PieceAuth.SecretText({
  displayName: 'API Token',
  description: `You can obtain your API token by navigating to **Settings->Developers->Tokens**.`,
  required: true,
});