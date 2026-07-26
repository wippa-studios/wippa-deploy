import { HttpMethod } from '@wippa/connectors-common';
import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { extractDataFromDocumentAction } from './lib/actions/extract-data-from-document';
import { uploadDocumentAction } from './lib/actions/upload-document-for-parsing';
import { airparserApiCall } from './lib/common';
import { documentParsedTrigger } from './lib/triggers/document-parsed';
import { airparserAuth } from './lib/auth';

export const airparser = createConnector({
	displayName: 'Airparser',
	description: 'Extract structured data from emails, PDFs, or documents with Airparser.',
	auth: airparserAuth,
	logoUrl: 'https://cdn.activepieces.com/pieces/airparser.png',
	authors: ['krushnarout','kishanprmr'],
	categories: [PieceCategory.PRODUCTIVITY],
	actions: [extractDataFromDocumentAction, uploadDocumentAction],
	triggers: [documentParsedTrigger],
});
