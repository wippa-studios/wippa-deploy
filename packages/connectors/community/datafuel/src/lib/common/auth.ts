import { PieceAuth } from '@wippa/pieces-framework';

export const dataFuelAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: `You can obtain API key from [Settings](https://app.datafuel.dev/account/api_key).`,
  required: true,
});
