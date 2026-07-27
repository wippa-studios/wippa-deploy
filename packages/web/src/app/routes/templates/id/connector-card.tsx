import { Card, CardContent } from '@/components/ui/card';
import { PieceIconWithPieceName, piecesHooks } from '@/features/connectors';
import { formatUtils } from '@/lib/format-utils';

type PieceCardProps = {
  connectorName: string;
};

export const ConnectorCard = ({ connectorName }: PieceCardProps) => {
  const { summary } = piecesHooks.usePieceSummary({ name: connectorName });

  return (
    <Card>
      <CardContent className="p-2 w-[165px] flex items-center gap-3">
        <PieceIconWithPieceName connectorName={connectorName} size="md" />
        <span className="text-sm font-medium">
          {summary?.displayName ||
            formatUtils.convertEnumToHumanReadable(connectorName)}
        </span>
      </CardContent>
    </Card>
  );
};
