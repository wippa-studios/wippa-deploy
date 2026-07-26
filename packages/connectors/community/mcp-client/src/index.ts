import { createConnector, PieceCategory } from '@wippa/connectors-framework';
import { callTool } from './lib/actions/call-tool';
import { mcpClientAuth } from './lib/auth';

export const mcpClient = createConnector({
  displayName: 'MCP Client',
  description: 'Call tools on an external MCP server deterministically, without an LLM.',
  auth: mcpClientAuth,
  minimumSupportedRelease: '0.86.3',
  logoUrl: 'https://cdn.activepieces.com/pieces/new-core/mcp.svg',
  authors: ['sanket-a11y'],
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE, PieceCategory.UNIVERSAL_AI],
  actions: [callTool],
  triggers: [],
});
