
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectorProperty } from '@wippa/connectors-framework'

export type ProcessorFn<INPUT = any, OUTPUT = any> = (
    property: ConnectorProperty,
    value: INPUT,
) => OUTPUT
