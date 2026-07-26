import { createAction, Property } from '@wippa/connectors-framework';
import { HttpMethod } from '@wippa/connectors-common';
import { promotekitAuth } from '../..';
import { promotekitApiCall, promotekitCommon } from '../common';

export const findCommission = createAction({
  auth: promotekitAuth,
  name: 'find_commission',
  displayName: 'Find Commission',
  description: 'Get details of a specific commission by ID.',
  audience: 'both',
  aiMetadata: {
    description: 'Fetch a single commission by its PromoteKit commission ID. Use when you already have the exact ID and need that commission\'s details; to discover IDs, list commissions first. Read-only and safe to repeat.',
    idempotent: true,
  },
  props: {
    commission_id: Property.ShortText({
      displayName: 'Commission ID',
      description: 'The ID of the commission to retrieve.',
      required: true,
    }),
  },
  async run(context) {
    const response = await promotekitApiCall<{
      data: Record<string, unknown>;
    }>({
      token: context.auth.secret_text,
      method: HttpMethod.GET,
      path: `/commissions/${context.propsValue.commission_id}`,
    });
    return promotekitCommon.flattenCommission(response.body.data);
  },
});
