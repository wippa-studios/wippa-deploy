import { PieceAuth } from '@wippa/pieces-framework';

export const barcodeLookupAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'API Key for Barcode Lookup',
  required: true,
});
