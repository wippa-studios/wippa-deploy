import {
  AppConnectionScope,
  AppConnectionWithoutSensitiveData,
} from '@wippa/shared';
import { t } from 'i18next';
import { Cable } from 'lucide-react';
import { useState } from 'react';

import { CreateOrEditConnectionDialog } from '@/app/connections/create-edit-connection-dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { piecesHooks } from '@/features/connectors';

type ReconnectButtonDialogProps = {
  connection: AppConnectionWithoutSensitiveData;
  onConnectionCreated: () => void;
  hasPermission: boolean;
};

const ReconnectButtonDialog = ({
  connection,
  onConnectionCreated,
  hasPermission,
}: ReconnectButtonDialogProps) => {
  const [open, setOpen] = useState(false);
  const { connectorModel, isLoading } = piecesHooks.usePiece({
    name: connection.connectorName,
    version: connection.connectorVersion,
    enabled: open,
  });

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Button
              onClick={() => setOpen(true)}
              disabled={!hasPermission}
              variant={'ghost'}
            >
              <Cable className="h-4 w-4" />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {!hasPermission ? (
            <p>{t('Permission needed')}</p>
          ) : (
            <p>{t('Reconnect')}</p>
          )}
        </TooltipContent>
      </Tooltip>
      {open && !isLoading && connectorModel && (
        <CreateOrEditConnectionDialog
          reconnectConnection={connection}
          isGlobalConnection={connection.scope === AppConnectionScope.PLATFORM}
          piece={connectorModel}
          open={open}
          key={`CreateOrEditConnectionDialog-open-${open}`}
          setOpen={(open, connection) => {
            setOpen(open);
            if (connection) {
              onConnectionCreated();
            }
          }}
        />
      )}
    </>
  );
};

export { ReconnectButtonDialog };
