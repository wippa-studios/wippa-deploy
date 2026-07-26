import { isNil } from '@wippa/core-utils';
import { PieceMetadataModel } from '@wippa/connectors-framework';

import { StepPropertySnapshot } from './explanation-prompt';

type BuildStepPropertiesSnapshotParams = {
  connectorModel: PieceMetadataModel | undefined;
  stepKind: 'action' | 'trigger';
  stepName: string | undefined;
  input: Record<string, unknown> | undefined;
};

const MAX_PROPERTIES = 25;

const toSnapshot = ({
  connectorModel,
  stepKind,
  stepName,
  input,
}: BuildStepPropertiesSnapshotParams): StepPropertySnapshot[] => {
  if (isNil(connectorModel) || isNil(stepName)) {
    return [];
  }
  const stepDefinition =
    stepKind === 'trigger'
      ? connectorModel.triggers?.[stepName]
      : connectorModel.actions?.[stepName];
  if (isNil(stepDefinition) || isNil(stepDefinition.props)) {
    return [];
  }
  const properties = Object.entries(stepDefinition.props).slice(
    0,
    MAX_PROPERTIES,
  );
  return properties.map(([name, prop]) => {
    const currentValue = input?.[name];
    return {
      name,
      displayName: prop.displayName,
      description: prop.description,
      type: prop.type,
      required: prop.required,
      defaultValue: prop.defaultValue,
      currentValue,
    };
  });
};

const findStepDescription = ({
  connectorModel,
  stepKind,
  stepName,
}: {
  connectorModel: PieceMetadataModel | undefined;
  stepKind: 'action' | 'trigger';
  stepName: string | undefined;
}): string | undefined => {
  if (isNil(connectorModel) || isNil(stepName)) {
    return undefined;
  }
  const definition =
    stepKind === 'trigger'
      ? connectorModel.triggers?.[stepName]
      : connectorModel.actions?.[stepName];
  return definition?.description;
};

const findPieceAuthType = (
  connectorModel: PieceMetadataModel | undefined,
): string | undefined => {
  if (isNil(connectorModel) || isNil(connectorModel.auth)) {
    return undefined;
  }
  const auth = Array.isArray(connectorModel.auth)
    ? connectorModel.auth[0]
    : connectorModel.auth;
  return auth?.type;
};

export const stepPropertiesSnapshotUtils = {
  build: toSnapshot,
  findDescription: findStepDescription,
  findAuthType: findPieceAuthType,
};
