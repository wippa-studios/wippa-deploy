import { piecesHooks } from '../hooks/pieces-hooks';

import { ConnectorIcon } from './connector-icon';

type PieceIconWithPieceNameProps = {
  connectorName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  showTooltip?: boolean;
};

const PieceIconWithPieceName = ({
  connectorName,
  size = 'md',
  border = true,
  showTooltip = true,
}: PieceIconWithPieceNameProps) => {
  const { summary } = piecesHooks.usePieceSummary({ name: connectorName });

  return (
    <ConnectorIcon
      size={size}
      border={border}
      displayName={summary?.displayName}
      logoUrl={summary?.logoUrl}
      showTooltip={showTooltip}
    />
  );
};

export { PieceIconWithPieceName };
