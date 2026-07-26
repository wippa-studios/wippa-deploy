import { createConnector, PieceAuth, Property } from '@wippa/connectors-framework';
import { createRecordAction } from './lib/actions/create-record';
import { deleteRecordAction } from './lib/actions/delete-record';
import { updateRecordAction } from './lib/actions/update-record';
import { getRecordAction } from './lib/actions/get-record';
import { searchRecordsAction } from './lib/actions/search-records';
import { nocodbAuth } from './lib/auth';

export const nocodb = createConnector({
	displayName: 'NocoDB',
	auth: nocodbAuth,
	minimumSupportedRelease: '0.30.0',
	logoUrl: 'https://cdn.activepieces.com/pieces/nocodb.png',
	authors: ['kishanprmr'],
	actions: [
		createRecordAction,
		deleteRecordAction,
		updateRecordAction,
		getRecordAction,
		searchRecordsAction,
	],
	triggers: [],
});
