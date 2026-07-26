import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { convertJsonToXml } from './lib/actions/convert-json-to-xml';
import { convertXmlToJson } from './lib/actions/convert-xml-to-json';

export const xml = createConnector({
  displayName: 'XML',
  description: 'Extensible Markup Language for storing and transporting data',

  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/xml.png',
  categories: [PieceCategory.CORE],
  auth: PieceAuth.None(),
  authors: ["Willianwg","kishanprmr","AbdulTheActivePiecer","khaledmashaly","abuaboud"],
  actions: [convertJsonToXml, convertXmlToJson],
  triggers: [],
});
