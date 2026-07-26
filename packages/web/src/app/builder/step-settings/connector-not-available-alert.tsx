import { t } from 'i18next';
import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type PieceNotAvailableAlertProps = {
  connectorName: string;
  connectorVersion: string;
};

export const PieceNotAvailableAlert = ({
  connectorName,
  connectorVersion,
}: PieceNotAvailableAlertProps) => (
  <Alert variant="destructive">
    <AlertTriangle className="size-4" />
    <AlertTitle>{t('Piece not available')}</AlertTitle>
    <AlertDescription>
      {t('pieceNotAvailableOnInstanceNote', {
        connectorName,
        connectorVersion,
      })}
    </AlertDescription>
  </Alert>
);
