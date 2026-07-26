import { ActionBase, TriggerBase } from '@wippa/connectors-framework';
import { ConnectorSet } from '@wippa/shared';
import { t } from 'i18next';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pieceSetMutations } from '@/features/piece-sets';
import { piecesHooks } from '@/features/pieces';
import { cn } from '@/lib/utils';

type PieceComponentVisibilitySheetProps = {
  connectorName: string;
  connectorDisplayName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connectorSet: ConnectorSet;
};

type ComponentItem =
  | { type: 'action'; data: ActionBase }
  | { type: 'trigger'; data: TriggerBase };

type VisibilityMode = 'all' | 'selected';

export const PieceComponentVisibilitySheet = ({
  connectorName,
  connectorDisplayName,
  open,
  onOpenChange,
  connectorSet,
}: PieceComponentVisibilitySheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] flex flex-col p-0">
        <PieceComponentVisibilitySheetContent
          key={`${connectorName}:${open}`}
          connectorName={connectorName}
          connectorDisplayName={connectorDisplayName}
          open={open}
          onOpenChange={onOpenChange}
          connectorSet={connectorSet}
        />
      </SheetContent>
    </Sheet>
  );
};

PieceComponentVisibilitySheet.displayName = 'PieceComponentVisibilitySheet';

function PieceComponentVisibilitySheetContent({
  connectorName,
  connectorDisplayName,
  open,
  onOpenChange,
  connectorSet,
}: PieceComponentVisibilitySheetProps) {
  const { connectorModel, isLoading } = piecesHooks.usePiece({
    name: connectorName,
    enabled: open,
  });

  const allActionNames = useMemo(
    () => (connectorModel ? Object.keys(connectorModel.actions) : []),
    [connectorModel],
  );
  const allTriggerNames = useMemo(
    () => (connectorModel ? Object.keys(connectorModel.triggers) : []),
    [connectorModel],
  );

  const originalMode: VisibilityMode =
    connectorName in connectorSet.config.selectedActions ||
    connectorName in connectorSet.config.selectedTriggers
      ? 'selected'
      : 'all';

  const originalHiddenActions = useMemo(() => {
    if (originalMode !== 'selected') {
      return [];
    }
    const selected = connectorSet.config.selectedActions[connectorName] ?? [];
    return allActionNames.filter((n) => !selected.includes(n));
  }, [connectorSet, connectorName, originalMode, allActionNames]);

  const originalHiddenTriggers = useMemo(() => {
    if (originalMode !== 'selected') {
      return [];
    }
    const selected = connectorSet.config.selectedTriggers[connectorName] ?? [];
    return allTriggerNames.filter((n) => !selected.includes(n));
  }, [connectorSet, connectorName, originalMode, allTriggerNames]);

  const [mode, setMode] = useState<VisibilityMode>(originalMode);
  const [touchedHiddenActions, setTouchedHiddenActions] = useState<
    string[] | null
  >(null);
  const [touchedHiddenTriggers, setTouchedHiddenTriggers] = useState<
    string[] | null
  >(null);

  const localHiddenActions = touchedHiddenActions ?? originalHiddenActions;
  const localHiddenTriggers = touchedHiddenTriggers ?? originalHiddenTriggers;
  const setLocalHiddenActions = (
    updater: string[] | ((prev: string[]) => string[]),
  ) =>
    setTouchedHiddenActions((prev) => {
      const current = prev ?? originalHiddenActions;
      return typeof updater === 'function' ? updater(current) : updater;
    });
  const setLocalHiddenTriggers = (
    updater: string[] | ((prev: string[]) => string[]),
  ) =>
    setTouchedHiddenTriggers((prev) => {
      const current = prev ?? originalHiddenTriggers;
      return typeof updater === 'function' ? updater(current) : updater;
    });

  const { mutate: updatePieceSet, isPending: isPieceSetPending } =
    pieceSetMutations.useUpdatePieceSet();

  const isMutating = isPieceSetPending;

  const allActions = useMemo<ComponentItem[]>(() => {
    if (!connectorModel) return [];
    return Object.values(connectorModel.actions).map((a) => ({
      type: 'action' as const,
      data: a,
    }));
  }, [connectorModel]);

  const allTriggers = useMemo<ComponentItem[]>(() => {
    if (!connectorModel) return [];
    return Object.values(connectorModel.triggers).map((tr) => ({
      type: 'trigger' as const,
      data: tr,
    }));
  }, [connectorModel]);

  const visibleActionCount = allActions.filter(
    (item) => !localHiddenActions.includes(item.data.name),
  ).length;
  const visibleTriggerCount = allTriggers.filter(
    (item) => !localHiddenTriggers.includes(item.data.name),
  ).length;

  const totalCount = allActions.length + allTriggers.length;
  const checkedCount = visibleActionCount + visibleTriggerCount;
  const selectAllState: boolean | 'indeterminate' =
    checkedCount === 0
      ? false
      : checkedCount === totalCount
      ? true
      : 'indeterminate';

  const toggleComponent = (item: ComponentItem) => {
    if (item.type === 'action') {
      setLocalHiddenActions((prev) =>
        prev.includes(item.data.name)
          ? prev.filter((n) => n !== item.data.name)
          : [...prev, item.data.name],
      );
    } else {
      setLocalHiddenTriggers((prev) =>
        prev.includes(item.data.name)
          ? prev.filter((n) => n !== item.data.name)
          : [...prev, item.data.name],
      );
    }
  };

  const toggleSelectAll = () => {
    if (checkedCount === totalCount) {
      setLocalHiddenActions(allActions.map((item) => item.data.name));
      setLocalHiddenTriggers(allTriggers.map((item) => item.data.name));
    } else {
      setLocalHiddenActions([]);
      setLocalHiddenTriggers([]);
    }
  };

  const hiddenChanged =
    JSON.stringify([...localHiddenActions].sort()) !==
      JSON.stringify([...originalHiddenActions].sort()) ||
    JSON.stringify([...localHiddenTriggers].sort()) !==
      JSON.stringify([...originalHiddenTriggers].sort());

  const isDirty =
    mode !== originalMode || (mode === 'selected' && hiddenChanged);

  const handleSave = () => {
    if (mode === 'all') {
      updatePieceSet(
        {
          id: connectorSet.id,
          request: {
            actions: { [connectorName]: { mode: 'all' } },
            triggers: { [connectorName]: { mode: 'all' } },
          },
        },
        { onSuccess: () => onOpenChange(false) },
      );
      return;
    }

    const selectedActionNames = allActionNames.filter(
      (n) => !localHiddenActions.includes(n),
    );
    const selectedTriggerNames = allTriggerNames.filter(
      (n) => !localHiddenTriggers.includes(n),
    );

    updatePieceSet(
      {
        id: connectorSet.id,
        request: {
          actions: {
            [connectorName]: { mode: 'selected', selected: selectedActionNames },
          },
          triggers: {
            [connectorName]: {
              mode: 'selected',
              selected: selectedTriggerNames,
            },
          },
        },
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const showCheckboxes = mode === 'selected';

  return (
    <>
      <SheetHeader className="px-6 py-4 border-b shrink-0">
        <SheetTitle className="text-base">{t('Actions & triggers')}</SheetTitle>
        <SheetDescription>
          {t('For {name} in this piece set', { name: connectorDisplayName })}
        </SheetDescription>
      </SheetHeader>

      <div className="px-6 pt-4 pb-3 border-b shrink-0 flex flex-col gap-2.5">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as VisibilityMode)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              {t('All actions & triggers')}
            </TabsTrigger>
            <TabsTrigger value="selected" className="flex-1">
              {t('Only selected')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-xs text-muted-foreground">
          {mode === 'all'
            ? t(
                'Every current and future action or trigger in this piece is available to end users. Nothing to configure.',
              )
            : t(
                'Only the checked items below are available. New actions and triggers added to this piece later stay hidden until you check them here.',
              )}
        </p>
      </div>

      {showCheckboxes && (
        <div className="px-6 pt-3 flex items-center gap-2.5 shrink-0">
          <Checkbox
            checked={selectAllState}
            onCheckedChange={toggleSelectAll}
            disabled={totalCount === 0}
          />
          <span className="text-sm font-medium">{t('Select all')}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {t('{count} of {total} selected', {
              count: checkedCount,
              total: totalCount,
            })}
          </span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : totalCount === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            {t('No actions or triggers found')}
          </div>
        ) : (
          <>
            {allActions.length > 0 && (
              <ComponentSection
                label={t('Actions')}
                items={allActions}
                visibleCount={visibleActionCount}
                hiddenNames={localHiddenActions}
                showCheckboxes={showCheckboxes}
                onToggle={toggleComponent}
              />
            )}
            {allTriggers.length > 0 && (
              <ComponentSection
                label={t('Triggers')}
                items={allTriggers}
                visibleCount={visibleTriggerCount}
                hiddenNames={localHiddenTriggers}
                showCheckboxes={showCheckboxes}
                onToggle={toggleComponent}
              />
            )}
          </>
        )}
      </div>

      <div className="px-6 py-4 border-t shrink-0 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isMutating}
        >
          {t('Cancel')}
        </Button>
        <Button disabled={!isDirty || isMutating} onClick={handleSave}>
          {isMutating && <Loader2 className="size-4 animate-spin" />}
          {t('Save changes')}
        </Button>
      </div>
    </>
  );
}

type ComponentSectionProps = {
  label: string;
  items: ComponentItem[];
  visibleCount: number;
  hiddenNames: string[];
  showCheckboxes: boolean;
  onToggle: (item: ComponentItem) => void;
};

function ComponentSection({
  label,
  items,
  visibleCount,
  hiddenNames,
  showCheckboxes,
  onToggle,
}: ComponentSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <CollapsibleTrigger className="flex items-center gap-2 pt-4 pb-1.5 w-full">
        {expanded ? (
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        )}
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Badge variant="inverted" className="text-xs font-bold">
          {visibleCount}/{items.length}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="divide-y">
          {items.map((item) => {
            const isHidden = hiddenNames.includes(item.data.name);
            return (
              <label
                key={`${item.type}:${item.data.name}`}
                className={cn(
                  'flex items-center gap-3 py-2.5',
                  showCheckboxes && 'cursor-pointer',
                  showCheckboxes && isHidden && 'opacity-50',
                )}
              >
                {showCheckboxes && (
                  <Checkbox
                    checked={!isHidden}
                    onCheckedChange={() => onToggle(item)}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {item.data.displayName}
                    </span>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-xs capitalize"
                    >
                      {item.type}
                    </Badge>
                  </div>
                  {item.data.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {item.data.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
