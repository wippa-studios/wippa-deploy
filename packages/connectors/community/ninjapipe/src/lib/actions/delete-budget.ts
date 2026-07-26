import { createAction } from '@wippa/connectors-framework';
import { HttpMethod } from '@wippa/connectors-common';
import { ninjapipeAuth } from '../../';
import { ninjapipeApiCall, getAuth, ninjapipeCommon } from '../common';

export const deleteBudget = createAction({
  auth: ninjapipeAuth,
  name: 'delete_budget',
  displayName: 'Delete Budget',
  description: 'Deletes a budget by ID.',
  audience: 'both',
  aiMetadata: { description: 'Permanently deletes a budget identified by Budget ID. Pick this to remove a budget and its tracking; the change is destructive and cannot be undone. Re-running after deletion typically fails since the ID no longer exists.', idempotent: false },
  props: {
    budgetId: ninjapipeCommon.budgetDropdownRequired,
  },
  async run(context) {
    const auth = getAuth(context);
    await ninjapipeApiCall<Record<string, unknown>>({ auth, method: HttpMethod.DELETE, path: `/budgets/${encodeURIComponent(String(context.propsValue.budgetId))}` });
    return { success: true, deleted_id: context.propsValue.budgetId };
  },
});
