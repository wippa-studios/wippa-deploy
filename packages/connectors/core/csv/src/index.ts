import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { csvToJsonAction } from './lib/actions/convert-csv-to-json';
import { jsonToCsvAction } from './lib/actions/convert-json-to-csv';
import { excelToCsvAction } from './lib/actions/convert-excel-to-csv';

export const csv = createConnector({
  displayName: 'CSV',
  description: 'Manipulate CSV text',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/new-core/csv.svg',
  auth: PieceAuth.None(),
  categories: [PieceCategory.CORE],
  actions: [csvToJsonAction, jsonToCsvAction, excelToCsvAction],
  authors: ["kishanprmr", "MoShizzle", "khaledmashaly", "abuaboud", 'sanket-a11y'],
  triggers: [],
});
