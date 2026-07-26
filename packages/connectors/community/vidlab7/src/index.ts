import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createVideo } from './lib/actions/create-video';
import { vidlab7Auth } from './lib/common/auth';

export const vidlab7 = createConnector({
  displayName: 'VidLab7',
  auth: vidlab7Auth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/vidlab7.png',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  description:
    'AI Avatars that pitch, show demos, qualify buyers, follow up, secure meetings and close deals – on autopilot.',
  authors: ['sanket-a11y'],
  actions: [createVideo],
  triggers: [],
});
