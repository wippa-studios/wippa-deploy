import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { opnformNewSubmission } from './lib/triggers/new-submission';
import { API_URL_DEFAULT } from './lib/common';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { opnformAuth } from './lib/auth';

export const opnform = createConnector({
    displayName: 'Opnform',
    description: 'Create beautiful online forms and surveys with unlimited fields and submissions',
    auth: opnformAuth,
    minimumSupportedRelease: '0.36.1',
    logoUrl: 'https://cdn.activepieces.com/pieces/opnform.png',
    categories: [PieceCategory.FORMS_AND_SURVEYS],
    authors: ['JhumanJ', 'chiragchhatrala'],
    actions: [
        createCustomApiCallAction({
            auth: opnformAuth,
            baseUrl: (auth) => {
                return auth?.props.baseApiUrl || API_URL_DEFAULT;
            },
            authMapping: async (auth) => {
                return {
                    Authorization: `Bearer ${auth.props.apiKey}`,
                };
            },
        }),
    ],
    triggers: [opnformNewSubmission],
});
