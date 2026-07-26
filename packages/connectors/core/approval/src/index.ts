import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { createApprovalLink } from './lib/actions/create-approval-link';
import { waitForApprovalLink } from './lib/actions/wait-for-approval';

export const approval = createConnector({
  displayName: 'Approval (Legacy)',
  description: 'Build approval process in your workflows',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.82.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/new-core/approvals.svg',
  authors: ["kishanprmr","MoShizzle","khaledmashaly","abuaboud"],
  categories: [PieceCategory.CORE, PieceCategory.FLOW_CONTROL],
  actions: [waitForApprovalLink, createApprovalLink],
  triggers: [],
});
