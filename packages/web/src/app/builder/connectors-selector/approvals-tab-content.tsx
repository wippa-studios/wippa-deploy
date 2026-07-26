import { isNil } from '@wippa/core-utils';
import { FlowActionType, FlowOperationType } from '@wippa/shared';

import { CardList, CardListItemSkeleton } from '@/components/custom/card-list';
import {
  piecesHooks,
  PieceSelectorTabType,
  usePieceSelectorTabs,
  PieceSelectorOperation,
  stepUtils,
} from '@/features/pieces';

import { useBuilderStateContext } from '../builder-hooks';

import GenericActionOrTriggerItem from './generic-connector-selector-item';

const APPROVAL_PIECES_CONFIG = [
  {
    connectorName: '@wippa/connector-slack',
    approvalActionNames: [
      'request_approval_message',
      'request_approval_direct_message',
    ],
  },
  {
    connectorName: '@wippa/connector-discord',
    approvalActionNames: ['request_approval_message'],
  },
  {
    connectorName: '@wippa/connector-microsoft-teams',
    approvalActionNames: [
      'request_approval_direct_message',
      'request_approval_in_channel',
    ],
  },
  {
    connectorName: '@wippa/connector-microsoft-outlook',
    approvalActionNames: ['request_approval_in_mail'],
  },
  {
    connectorName: '@wippa/connector-gmail',
    approvalActionNames: ['request_approval_in_mail'],
  },
  {
    connectorName: '@wippa/connector-telegram-bot',
    approvalActionNames: ['request_approval_message'],
  },
];

const ApprovalsTabContent = ({
  operation,
}: {
  operation: PieceSelectorOperation;
}) => {
  const { selectedTab } = usePieceSelectorTabs();
  const [handleAddingOrUpdatingStep] = useBuilderStateContext((state) => [
    state.handleAddingOrUpdatingStep,
  ]);

  const pieceQueries = piecesHooks.useMultiplePieces({
    names: APPROVAL_PIECES_CONFIG.map((config) => config.connectorName),
  });

  const isLoading = pieceQueries.some((query) => query.isLoading);
  const allPiecesLoaded = pieceQueries.every(
    (query) => query.isSuccess && !isNil(query.data),
  );

  if (
    selectedTab !== PieceSelectorTabType.APPROVALS ||
    ![FlowOperationType.ADD_ACTION, FlowOperationType.UPDATE_ACTION].includes(
      operation.type,
    )
  ) {
    return null;
  }

  if (isLoading || !allPiecesLoaded) {
    return (
      <div className="flex flex-col gap-2 w-full p-2">
        <CardListItemSkeleton numberOfCards={3} withCircle={false} />
      </div>
    );
  }

  const allApprovalActions = pieceQueries.flatMap((query) => {
    if (!query.data) return [];

    const config = APPROVAL_PIECES_CONFIG.find(
      (config) => config.connectorName === query.data.name,
    );
    if (isNil(config)) return [];
    const connectorMetadata = stepUtils.mapPieceToMetadata({
      piece: query.data,
      type: 'action',
    });

    return config.approvalActionNames
      .map((actionName) => {
        const action = query.data.actions[actionName];
        if (!action) return null;
        return {
          action,
          connectorMetadata,
        };
      })
      .filter((item) => !isNil(item));
  });

  return (
    <CardList listClassName="gap-0">
      {allApprovalActions.map((item) => (
        <GenericActionOrTriggerItem
          key={`${item.connectorMetadata.connectorName}-${item.action.name}`}
          item={{
            actionOrTrigger: item.action,
            type: FlowActionType.PIECE,
            connectorMetadata: item.connectorMetadata,
          }}
          hidePieceIconAndDescription={false}
          stepMetadataWithSuggestions={{
            ...item.connectorMetadata,
            suggestedActions: [item.action],
            suggestedTriggers: [],
          }}
          onClick={() => {
            handleAddingOrUpdatingStep({
              pieceSelectorItem: {
                actionOrTrigger: item.action,
                type: FlowActionType.PIECE,
                connectorMetadata: item.connectorMetadata,
              },
              operation,
              selectStepAfter: true,
            });
          }}
        />
      ))}
    </CardList>
  );
};

export { ApprovalsTabContent };
