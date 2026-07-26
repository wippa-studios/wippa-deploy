import { isNil } from '@wippa/core-utils';
import type { OutputSchema } from '@wippa/connectors-framework';

import { piecesHooks } from './pieces-hooks';

function usePieceOutputSchema({
  connectorName,
  connectorVersion,
  stepName,
}: {
  connectorName?: string;
  connectorVersion?: string;
  stepName?: string;
}): OutputSchema | null {
  const { connectorModel } = piecesHooks.usePiece({
    name: connectorName ?? '',
    version: connectorVersion,
    enabled: !isNil(connectorName) && !isNil(stepName),
  });

  if (!connectorModel || !stepName) return null;
  const fromTrigger = connectorModel.triggers?.[stepName]?.outputSchema;
  if (fromTrigger) return fromTrigger;
  const fromAction = connectorModel.actions?.[stepName]?.outputSchema;
  if (fromAction) return fromAction;
  return null;
}

export { usePieceOutputSchema };
