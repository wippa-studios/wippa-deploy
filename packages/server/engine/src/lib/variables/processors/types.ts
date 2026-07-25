
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieceProperty } from '@wippa/pieces-framework'

export type ProcessorFn<INPUT = any, OUTPUT = any> = (
    property: PieceProperty,
    value: INPUT,
) => OUTPUT
