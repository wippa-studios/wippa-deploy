import {
  createConnector,
  PieceAuth,
  Property,
} from '@wippa/connectors-framework';
import { askGpt } from './lib/actions/ask-gpt';
import { azureOpenaiAuth } from './lib/auth';

export const azureOpenai = createConnector({
  displayName: 'Azure OpenAI',
  description: 'Powerful AI tools from Microsoft',
  auth: azureOpenaiAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/azure-openai.png',
  authors: ["MoShizzle","abuaboud"],
  actions: [askGpt],
  triggers: [],
});
