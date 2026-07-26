import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { onChatSubmission } from './lib/triggers/chat-trigger';
import { onFormSubmission } from './lib/triggers/form-trigger';
import { returnResponse } from './lib/actions/return-response';

export const forms = createConnector({
  displayName: 'Human Input',
  description: 'Trigger a flow through human input.',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.65.0',
  categories: [PieceCategory.CORE],
  logoUrl: 'https://cdn.activepieces.com/pieces/new-core/human-input.svg',
  authors: ['anasbarg', 'MoShizzle', 'abuaboud'],
  actions: [returnResponse],
  triggers: [onFormSubmission, onChatSubmission],
});
