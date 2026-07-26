import { createConnector } from '@wippa/connectors-framework';
import { barcodeLookupAuth } from './lib/common/auth';
import { searchByBarcode } from './lib/actions/search-by-barcode';
import { PieceCategory } from '@wippa/connectors-framework';

export const barcodeLookup = createConnector({
  displayName: 'Barcode Lookup',
  auth: barcodeLookupAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/barcode-lookup.png',
  authors: ['sanket-a11y'],
  categories: [PieceCategory.COMMERCE],
  description: 'Lookup product information by barcode number',
  actions: [searchByBarcode],
  triggers: [],
});
