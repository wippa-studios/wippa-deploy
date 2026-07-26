import { createCustomApiCallAction } from '@wippa/connectors-common';
import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { digitalOceanAuth, DigitalOceanAuthValue } from './lib/common/auth';
import {
  listDomains,
  createDomain,
  getDomain,
  deleteDomain,
  listDroplets,
  getDroplet,
  createDroplet,
  deleteDroplet,
  listDatabaseClusters,
  listDatabaseEvents,
} from './lib/actions';

export const digitalOcean = createConnector({
  displayName: 'DigitalOcean',
  auth: digitalOceanAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/digital-ocean.png',
  description: 'Cloud infrastructure provider for developers.',
  categories: [PieceCategory.DEVELOPER_TOOLS],
  authors: ['onyedikachi-david'],
  actions: [
    listDomains,
    createDomain,
    getDomain,
    deleteDomain,
    listDroplets,
    getDroplet,
    createDroplet,
    deleteDroplet,
    listDatabaseClusters,
    listDatabaseEvents,
    createCustomApiCallAction({
      baseUrl: () => 'https://api.digitalocean.com/v2',
      auth: digitalOceanAuth,
      authMapping: async (auth) => {
        const token = typeof auth === 'string' ? auth : (auth as { access_token: string }).access_token;
        return {
          Authorization: `Bearer ${token}`,
        };
      },
    }),
  ],
  triggers: [],
});
