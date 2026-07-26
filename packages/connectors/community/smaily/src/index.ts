import {
  createConnector,
  PieceAuth,
  PiecePropValueSchema,
  Property,
} from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import {
  AuthenticationType,
  httpClient,
  HttpMethod, createCustomApiCallAction 

} from '@wippa/connectors-common';
import { createOrUpdateSubscriberAction } from './lib/actions/create-or-update-subscriber.action';
import { getSubscriberAction } from './lib/actions/get-subscriber.action';
import { smailyAuth } from './lib/auth';

export const smaily = createConnector({
  displayName: 'Smaily',
  auth: smailyAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/smaily.png',
  categories: [PieceCategory.MARKETING],
  authors: ['kishanprmr'],
  actions: [createOrUpdateSubscriberAction, getSubscriberAction,
    createCustomApiCallAction({
      auth:smailyAuth,
      baseUrl: (auth)=>{
        if (!auth) {
          return '';
        }
        return `https://${auth.props.domain}.sendsmaily.net/api`
      },
      authMapping: async (auth) => ({
        Authorization: `Basic ${Buffer.from(
          `${auth.props.username}:${
            auth.props.password
          }`
        ).toString('base64')}`,
      }),
    })
  ],
  triggers: [],
});
