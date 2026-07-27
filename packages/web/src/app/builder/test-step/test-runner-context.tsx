import { useQueryClient } from '@tanstack/react-query';
import {
  FlowAction,
  FlowActionType,
  FlowTrigger,
  FlowTriggerType,
} from '@wippa/shared';
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { useBuilderStateContext } from '@/app/builder/builder-hooks';
import { ChatDrawerSource } from '@/app/builder/types';
import { pieceSelectorUtils, piecesHooks } from '@/features/connectors';

import { DynamicPropertiesContext } from '../connector-properties/dynamic-properties-context';

import { McpToolTestingDialog } from './custom-test-step/mcp-tool-testing-dialog';
import TestWebhookDialog from './custom-test-step/test-webhook-dialog';
import {
  TestType,
  triggerEventUtils,
} from './test-trigger-section/trigger-event-utils';
import { testStepHooks } from './utils/test-step-hooks';

const ActionTestRunnerContext =
  createContext<ActionTestRunnerContextValue | null>(null);

const isReturnResponseAndWaitForWebhook = (step: FlowAction) =>
  step.type === FlowActionType.PIECE &&
  step.settings.connectorName === '@wippa/connector-webhook' &&
  step.settings.actionName === 'return_response_and_wait_for_next_webhook';

const ActionTestRunnerProvider = ({
  step,
  children,
}: ActionTestRunnerProviderProps) => {
  const { mutate: testAction, isPending: isWaitingTestResult } =
    testStepHooks.useTestAction({ currentStep: step });
  const isStepBeingTested = useBuilderStateContext(
    (state) => state.isStepBeingTested,
  );
  const { isLoadingDynamicProperties } = useContext(DynamicPropertiesContext);
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);

  const isTesting =
    isWaitingTestResult || isStepBeingTested(step.name) || showWebhookDialog;

  const canFireTest =
    step.valid !== false && !isTesting && !isLoadingDynamicProperties;

  const fireTest = useCallback(() => {
    if (!canFireTest) return;
    if (isReturnResponseAndWaitForWebhook(step)) {
      setShowWebhookDialog(true);
    } else {
      testAction(undefined);
    }
  }, [canFireTest, step, testAction]);

  return (
    <ActionTestRunnerContext.Provider
      value={{ fireTest, isTesting, canFireTest }}
    >
      {children}
      {showWebhookDialog && (
        <TestWebhookDialog
          testingMode="returnResponseAndWaitForNextWebhook"
          open={true}
          onOpenChange={(open) => !open && setShowWebhookDialog(false)}
          currentStep={step}
        />
      )}
    </ActionTestRunnerContext.Provider>
  );
};

const useActionTestRunner = () => useContext(ActionTestRunnerContext);

ActionTestRunnerProvider.displayName = 'ActionTestRunnerProvider';

const TriggerTestRunnerContext =
  createContext<TriggerTestRunnerContextValue | null>(null);

const TriggerTestRunnerProvider = ({
  step,
  children,
}: TriggerTestRunnerProviderProps) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [isTestingDialogOpen, setIsTestingDialogOpen] = useState(false);
  const abortControllerRef = useRef<AbortController>(new AbortController());

  const [setChatDrawerOpenSource, flowVersionId] = useBuilderStateContext(
    (state) => [state.setChatDrawerOpenSource, state.flowVersion.id],
  );
  const { isLoadingDynamicProperties } = useContext(DynamicPropertiesContext);
  const queryClient = useQueryClient();

  const isPieceTrigger = step.type === FlowTriggerType.PIECE;
  const connectorName = isPieceTrigger ? step.settings.connectorName : '';
  const connectorVersion = isPieceTrigger ? step.settings.connectorVersion : undefined;
  const triggerName = isPieceTrigger ? step.settings.triggerName : undefined;

  const { connectorModel, isLoading: isPieceLoading } = piecesHooks.usePiece({
    name: connectorName,
    version: connectorVersion,
    enabled: isPieceTrigger && !!connectorName,
  });

  const trigger = triggerName ? connectorModel?.triggers?.[triggerName] : undefined;
  const mockData = trigger?.sampleData;

  const testType: TestType | null =
    trigger && triggerName && connectorName
      ? triggerEventUtils.getTestType({ triggerName, connectorName, trigger })
      : null;

  const isManualTrigger =
    connectorName && triggerName
      ? pieceSelectorUtils.isManualTrigger({ connectorName, triggerName })
      : false;

  const onTestSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ['triggerEvents', flowVersionId],
    });
  }, [queryClient, flowVersionId]);

  const { mutate: saveMockAsSampleData, isPending: isSavingMockdata } =
    testStepHooks.useSaveMockData({
      onSuccess: onTestSuccess,
    });

  const {
    mutate: simulateTrigger,
    isPending: isSimulating,
    reset: resetSimulation,
  } = testStepHooks.useSimulateTrigger({
    setErrorMessage,
    onSuccess: async () => {
      await onTestSuccess();
      setIsTestingDialogOpen(false);
    },
  });

  const { mutate: pollTrigger, isPending: isPollingTesting } =
    testStepHooks.usePollTrigger({
      setErrorMessage,
      onSuccess: onTestSuccess,
    });

  const isTesting =
    isSimulating || isPollingTesting || isSavingMockdata || isTestingDialogOpen;

  const isValid = step.valid !== false;
  const canFireTest =
    isValid &&
    !isTesting &&
    !isLoadingDynamicProperties &&
    !isPieceLoading &&
    !isManualTrigger &&
    testType !== null;

  const fireTest = useCallback(() => {
    if (!canFireTest || !testType) return;
    switch (testType) {
      case 'chat-trigger':
        setChatDrawerOpenSource(ChatDrawerSource.TEST_STEP);
        simulateTrigger(abortControllerRef.current.signal);
        break;
      case 'simulation':
      case 'webhook':
        simulateTrigger(abortControllerRef.current.signal);
        break;
      case 'polling':
        pollTrigger();
        break;
      case 'mcp-tool':
        setIsTestingDialogOpen(true);
        break;
    }
  }, [
    canFireTest,
    testType,
    simulateTrigger,
    pollTrigger,
    setChatDrawerOpenSource,
  ]);

  return (
    <TriggerTestRunnerContext.Provider
      value={{
        step,
        connectorModel,
        isPieceLoading,
        testType,
        mockData,
        isValid,
        canFireTest,
        isTesting,
        isSimulating,
        isSavingMockdata,
        isPollingTesting,
        errorMessage,
        setErrorMessage,
        isTestingDialogOpen,
        setIsTestingDialogOpen,
        abortControllerRef,
        simulateTrigger,
        pollTrigger,
        saveMockAsSampleData,
        resetSimulation,
        fireTest,
        onTestSuccess,
      }}
    >
      {children}
      {testType === 'mcp-tool' && (
        <McpToolTestingDialog
          open={isTestingDialogOpen}
          onOpenChange={setIsTestingDialogOpen}
          onTestingSuccess={onTestSuccess}
        />
      )}
    </TriggerTestRunnerContext.Provider>
  );
};

const useTriggerTestRunner = () => useContext(TriggerTestRunnerContext);

TriggerTestRunnerProvider.displayName = 'TriggerTestRunnerProvider';

export {
  ActionTestRunnerProvider,
  useActionTestRunner,
  TriggerTestRunnerProvider,
  useTriggerTestRunner,
};

type ActionTestRunnerContextValue = {
  fireTest: () => void;
  isTesting: boolean;
  canFireTest: boolean;
};

type ActionTestRunnerProviderProps = {
  step: FlowAction;
  children: React.ReactNode;
};

type TriggerTestRunnerContextValue = {
  step: FlowTrigger;
  connectorModel: ReturnType<typeof piecesHooks.usePiece>['connectorModel'];
  isPieceLoading: boolean;
  testType: TestType | null;
  mockData: unknown;
  isValid: boolean;
  canFireTest: boolean;
  isTesting: boolean;
  isSimulating: boolean;
  isSavingMockdata: boolean;
  isPollingTesting: boolean;
  errorMessage: string | undefined;
  setErrorMessage: (msg: string | undefined) => void;
  isTestingDialogOpen: boolean;
  setIsTestingDialogOpen: (open: boolean) => void;
  abortControllerRef: React.MutableRefObject<AbortController>;
  simulateTrigger: (signal: AbortSignal) => void;
  pollTrigger: () => void;
  saveMockAsSampleData: (mockData: unknown) => void;
  resetSimulation: () => void;
  fireTest: () => void;
  onTestSuccess: () => Promise<void>;
};

type TriggerTestRunnerProviderProps = {
  step: FlowTrigger;
  children: React.ReactNode;
};
