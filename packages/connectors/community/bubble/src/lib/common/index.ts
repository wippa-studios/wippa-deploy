import { Property } from '@wippa/connectors-framework';

export const bubbleCommon = {
  typename: Property.ShortText({
    displayName: 'Typename',
    required: true,
  }),
  fields: Property.Json({
    displayName: 'Body',
    required: false,
  }),
  thing_id: Property.ShortText({
    displayName: 'Thing ID',
    required: true,
  }),
};
