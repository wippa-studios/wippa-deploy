import { piecesHooks } from '../hooks/pieces-hooks';

type PieceDisplayNameProps = {
  connectorName: string;
  fallback?: string;
};

const ConnectorDisplayName = ({ connectorName, fallback }: PieceDisplayNameProps) => {
  const { summary } = piecesHooks.usePieceSummary({ name: connectorName });

  return <span>{summary?.displayName || fallback || connectorName}</span>;
};

export { ConnectorDisplayName };
