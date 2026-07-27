import { TriggerBase, TriggerStrategy } from '@wippa/connectors-framework';
import { TriggerTestStrategy } from '@wippa/shared';

import { pieceSelectorUtils } from '@/features/connectors';

export type TestType =
  | 'mcp-tool'
  | 'chat-trigger'
  | 'simulation'
  | 'webhook'
  | 'polling';

export const triggerEventUtils = {
  getTestType: ({
    triggerName,
    connectorName,
    trigger,
  }: {
    triggerName: string;
    connectorName: string;
    trigger: TriggerBase;
  }): TestType => {
    if (pieceSelectorUtils.isMcpToolTrigger(connectorName, triggerName)) {
      return 'mcp-tool';
    }
    if (pieceSelectorUtils.isChatTrigger(connectorName, triggerName)) {
      return 'chat-trigger';
    }
    if (
      connectorName === '@wippa/connector-webhook' &&
      triggerName === 'catch_webhook'
    ) {
      return 'webhook';
    }

    if (
      trigger.type === TriggerStrategy.APP_WEBHOOK ||
      trigger.type === TriggerStrategy.WEBHOOK
    ) {
      switch (trigger.testStrategy) {
        case TriggerTestStrategy.TEST_FUNCTION:
          return 'polling';
        case TriggerTestStrategy.SIMULATION:
          return 'simulation';
      }
    }

    return 'polling';
  },
};
