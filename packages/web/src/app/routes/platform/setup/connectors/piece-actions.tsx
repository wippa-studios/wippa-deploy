import { t } from 'i18next';
import { Pin, PinOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { platformPiecesMutations } from '@/features/platform-admin';
import { platformHooks } from '@/hooks/platform-hooks';

type PieceActionsProps = {
  connectorName: string;
  isEnabled: boolean;
};

const ConnectorActions = ({ connectorName, isEnabled }: PieceActionsProps) => {
  const { platform, refetch } = platformHooks.useCurrentPlatform();

  const { mutate: togglePin, isPending: isPinPending } =
    platformPiecesMutations.useTogglePiecePin({
      platformId: platform.id,
      pinnedPieces: platform.pinnedPieces,
      refetch,
    });

  const pinned = platform.pinnedPieces.includes(connectorName);

  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={'sm'}
            loading={isPinPending}
            disabled={!isEnabled}
            onClick={(e) => {
              if (!isEnabled) {
                e.preventDefault();
                return;
              }
              togglePin(connectorName);
            }}
          >
            {pinned ? (
              <PinOff className="size-4" />
            ) : (
              <Pin className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {pinned ? t('Unpin this piece') : t('Pin this piece')}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

ConnectorActions.displayName = 'ConnectorActions';

export { ConnectorActions };
