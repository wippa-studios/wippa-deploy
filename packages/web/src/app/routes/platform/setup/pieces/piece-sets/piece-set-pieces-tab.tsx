import { ColumnDef } from '@tanstack/react-table';
import { PieceMetadataModelSummary } from '@wippa/connectors-framework';
import {
  isPieceVisible,
  PieceSelection,
  PieceSelectionMode,
  ConnectorSet,
  UpdatePieceSetRequestBody,
} from '@wippa/shared';
import { t } from 'i18next';
import {
  CheckIcon,
  EyeOff,
  Eye,
  GitBranch,
  Hash,
  Package,
  Puzzle,
  SlidersHorizontal,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { DataTable, RowDataWithActions } from '@/components/custom/data-table';
import { DataTableColumnHeader } from '@/components/custom/data-table/data-table-column-header';
import { DataTableSelectPopover } from '@/components/custom/data-table/data-table-select-popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { pieceSetMutations } from '@/features/piece-sets';
import { ConnectorIcon, piecesHooks } from '@/features/pieces';
import { cn } from '@/lib/utils';

import { PieceComponentVisibilitySheet } from '../piece-component-visibility-sheet';

function setPieceVisible(
  pieces: PieceSelection,
  name: string,
  visible: boolean,
): PieceSelection {
  const isException = pieces.exceptions.includes(name);
  const shouldBeException =
    pieces.mode === PieceSelectionMode.INCLUDE_ALL ? !visible : visible;
  if (isException === shouldBeException) {
    return pieces;
  }
  return {
    mode: pieces.mode,
    exceptions: shouldBeException
      ? [...pieces.exceptions, name]
      : pieces.exceptions.filter((n) => n !== name),
  };
}

function setPiecesVisible(
  pieces: PieceSelection,
  names: string[],
  visible: boolean,
): PieceSelection {
  return names.reduce(
    (acc, name) => setPieceVisible(acc, name, visible),
    pieces,
  );
}

type PieceSetPiecesTabProps = {
  connectorSet: ConnectorSet;
};

const BulkPieceSetActions = ({
  connectorSet,
  selectedConnectors,
  resetSelection,
}: {
  connectorSet: ConnectorSet;
  selectedConnectors: PieceMetadataModelSummary[];
  resetSelection: () => void;
}) => {
  const {
    mutate: updateSet,
    isPending,
    variables,
  } = pieceSetMutations.useUpdatePieceSet();

  const selectedNames = selectedConnectors.map((p) => p.name);
  const allIncluded = selectedConnectors.every((p) =>
    isPieceVisible({ pieces: connectorSet.config.pieces, name: p.name }),
  );
  const allExcluded = selectedConnectors.every(
    (p) => !isPieceVisible({ pieces: connectorSet.config.pieces, name: p.name }),
  );

  const pendingRequest = (variables as { request: UpdatePieceSetRequestBody })
    ?.request;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        loading={isPending && !!pendingRequest?.pieces}
        disabled={allIncluded}
        onClick={() =>
          updateSet(
            {
              id: connectorSet.id,
              request: {
                pieces: setPiecesVisible(
                  connectorSet.config.pieces,
                  selectedNames,
                  true,
                ),
              },
            },
            { onSuccess: resetSelection },
          )
        }
      >
        <Eye className="mr-1 size-4" />
        {t('Include')}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        loading={isPending && !!pendingRequest?.pieces}
        disabled={allExcluded}
        onClick={() =>
          updateSet(
            {
              id: connectorSet.id,
              request: {
                pieces: setPiecesVisible(
                  connectorSet.config.pieces,
                  selectedNames,
                  false,
                ),
              },
            },
            { onSuccess: resetSelection },
          )
        }
      >
        <EyeOff className="mr-1 size-4" />
        {t('Exclude')}
      </Button>
    </>
  );
};

export const PieceSetPiecesTab = ({ connectorSet }: PieceSetPiecesTabProps) => {
  const { pieces, isLoading } = piecesHooks.usePieces({
    includeHidden: true,
    isTableQuery: true,
    skipProjectFilter: true,
  });
  const { mutate: updateSet, isPending } =
    pieceSetMutations.useUpdatePieceSet();
  const [selectedStatuses, setSelectedStatuses] = useState(new Set<string>());
  const [managingComponentsPiece, setManagingComponentsPiece] = useState<
    string | null
  >(null);

  const togglePiece = useCallback(
    (connectorName: string, currentlyIncluded: boolean) => {
      updateSet({
        id: connectorSet.id,
        request: {
          pieces: setPieceVisible(
            connectorSet.config.pieces,
            connectorName,
            !currentlyIncluded,
          ),
        },
      });
    },
    [updateSet, connectorSet.id, connectorSet.config.pieces],
  );

  const filteredPieces = useMemo(() => {
    const allPieces = pieces ?? [];
    if (selectedStatuses.size === 0) return allPieces;
    return allPieces.filter((piece) => {
      const included = isPieceVisible({
        pieces: connectorSet.config.pieces,
        name: piece.name,
      });
      return selectedStatuses.has(included ? 'enabled' : 'disabled');
    });
  }, [pieces, connectorSet, selectedStatuses]);

  const columns: ColumnDef<RowDataWithActions<PieceMetadataModelSummary>>[] =
    useMemo(
      () => [
        {
          accessorKey: 'displayName',
          size: 300,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t('Name')}
              icon={Puzzle}
            />
          ),
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <ConnectorIcon
                size={'sm'}
                border={true}
                displayName={row.original.displayName}
                logoUrl={row.original.logoUrl}
                showTooltip={false}
              />
              <div className="flex flex-col gap-0.5">
                <span>{row.original.displayName}</span>
              </div>
            </div>
          ),
        },
        {
          accessorKey: 'packageName',
          size: 250,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t('Package Name')}
              icon={Hash}
            />
          ),
          cell: ({ row }) => (
            <div className="text-left">{row.original.name}</div>
          ),
        },
        {
          accessorKey: 'version',
          size: 80,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t('Version')}
              icon={GitBranch}
            />
          ),
          cell: ({ row }) => (
            <div className="text-left">{row.original.version}</div>
          ),
        },
        {
          id: 'actionsAndTriggers',
          size: 180,
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t('Actions & triggers')}
              icon={SlidersHorizontal}
            />
          ),
          cell: ({ row }) => {
            const included = isPieceVisible({
              pieces: connectorSet.config.pieces,
              name: row.original.name,
            });
            const selectedActions =
              connectorSet.config.selectedActions[row.original.name];
            const selectedTriggers =
              connectorSet.config.selectedTriggers[row.original.name];
            const curated =
              row.original.name in connectorSet.config.selectedActions ||
              row.original.name in connectorSet.config.selectedTriggers;
            const total = row.original.actions + row.original.triggers;
            const selectedCount =
              (selectedActions?.length ?? row.original.actions) +
              (selectedTriggers?.length ?? row.original.triggers);
            return (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    disabled={!included}
                    onClick={() =>
                      setManagingComponentsPiece(row.original.name)
                    }
                    className={cn(
                      'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
                    )}
                  >
                    <Badge variant={curated ? 'default' : 'accent'}>
                      {curated
                        ? t('{count} of {total} selected', {
                            count: selectedCount,
                            total,
                          })
                        : t('All actions')}
                    </Badge>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('Manage actions & triggers')}
                </TooltipContent>
              </Tooltip>
            );
          },
        },
        {
          id: 'actions',
          size: 80,
          cell: ({ row }) => {
            const included = isPieceVisible({
              pieces: connectorSet.config.pieces,
              name: row.original.name,
            });
            return (
              <div className="flex items-center justify-end">
                <Switch
                  checked={included}
                  disabled={isPending}
                  onCheckedChange={() =>
                    togglePiece(row.original.name, included)
                  }
                />
              </div>
            );
          },
        },
      ],
      [connectorSet, togglePiece, isPending],
    );

  const managingPieceDisplayName = useMemo(
    () =>
      pieces?.find((p) => p.name === managingComponentsPiece)?.displayName ??
      managingComponentsPiece ??
      '',
    [pieces, managingComponentsPiece],
  );

  return (
    <>
      <DataTable
        emptyStateTextTitle={t('No pieces found')}
        emptyStateTextDescription={t(
          'Start by installing pieces that you want to use in your automations',
        )}
        emptyStateIcon={<Package className="size-14" />}
        columns={columns}
        filters={[
          {
            type: 'input',
            title: t('Piece Name'),
            accessorKey: 'displayName',
            icon: CheckIcon,
          },
        ]}
        customFilters={[
          <DataTableSelectPopover
            key="status-filter"
            title={t('Status')}
            selectedValues={new Set(selectedStatuses)}
            options={[
              { label: t('Enabled'), value: 'enabled' },
              { label: t('Disabled'), value: 'disabled' },
            ]}
            handleFilterChange={(values) =>
              setSelectedStatuses(new Set(values))
            }
          />,
        ]}
        page={{
          data: filteredPieces,
          next: null,
          previous: null,
        }}
        isLoading={isLoading}
        clientFiltering={true}
        bulkActions={[
          {
            render: (selectedRows, resetSelection) => (
              <BulkPieceSetActions
                connectorSet={connectorSet}
                selectedConnectors={selectedRows}
                resetSelection={resetSelection}
              />
            ),
          },
        ]}
        selectColumn={true}
        virtualizeRows={true}
        hidePagination={true}
      />
      {managingComponentsPiece && (
        <PieceComponentVisibilitySheet
          connectorName={managingComponentsPiece}
          connectorDisplayName={managingPieceDisplayName}
          open={true}
          onOpenChange={(open) => {
            if (!open) setManagingComponentsPiece(null);
          }}
          connectorSet={connectorSet}
        />
      )}
    </>
  );
};
