import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { flipandoAuth } from './lib/common/auth';
import { runApp } from './lib/actions/run-app';
import { getTask } from './lib/actions/get-task';
import { runAppGenerator } from './lib/actions/run-app-generator';
import { getAllApps } from './lib/actions/get-all-apps';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceCategory } from '@wippa/connectors-framework';

export const flipando = createConnector({
  displayName: 'Flipando AI',
  auth: flipandoAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/flipando.png',
  description:
    'Autonomous AI Agents Revolutionizing Compliance with Smart, Adaptive Workflows.',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  authors: ['sanket-a11y'],
  actions: [
    getAllApps,
    runApp,
    getTask,
    runAppGenerator,
    createCustomApiCallAction({
      auth: flipandoAuth,
      baseUrl: () => 'https://api.flipando.com/v1',
      authMapping: async (auth) => {
        return {
          Authorization: `Bearer ${auth.secret_text}`,
        };
      },
    }),
  ],
  triggers: [],
});
