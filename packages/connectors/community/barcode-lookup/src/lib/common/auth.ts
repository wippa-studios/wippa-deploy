import { PieceAuth } from '@wippa/connectors-framework';

export const barcodeLookupAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'API Key for Barcode Lookup',
  required: true,
});
