import { createConnector } from '@wippa/connectors-framework';
import { fellowAuth, getBaseUrl } from './lib/common/auth';
import { PieceCategory } from '@wippa/connectors-framework';
import { getNoteAction } from './lib/actions/get-note';
import { newRecordingTrigger } from './lib/triggers/new-recording';
import { createCustomApiCallAction } from '@wippa/connectors-common';

export const fellow = createConnector({
  displayName: 'Fellow.ai',
  description: 'AI Meeting Assistant and Notetaker',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE, PieceCategory.PRODUCTIVITY],
  auth: fellowAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/fellow.png',
  authors: ['kishanprmr'],
  actions: [getNoteAction,
    createCustomApiCallAction({
      auth: fellowAuth,
      baseUrl: (auth) => {
        return getBaseUrl(auth?.props.subdomain ?? '')
      },
      authMapping: async (auth) => {
        return {
          'X-API-KEY': `${auth.props.apiKey}`
        }
      }
    })],
  triggers: [newRecordingTrigger],
});
