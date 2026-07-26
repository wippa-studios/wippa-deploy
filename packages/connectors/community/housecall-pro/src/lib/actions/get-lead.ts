import { createAction, Property } from "@wippa/pieces-framework";
import { housecallProAuth, makeHousecallProRequest } from "../common";
import { HttpMethod } from "@wippa/pieces-common";

export const getLead = createAction({
  auth: housecallProAuth,
  name: "get_lead",
  displayName: "Get Lead",
  description: "Get the lead via ID.",
  audience: 'both',
  aiMetadata: {
    description: "Fetch a single Housecall Pro lead by its lead ID. Read-only and repeatable. Requires a known lead ID.",
    idempotent: true,
  },
  props: {
    id: Property.ShortText({
      displayName: "Lead ID",
      required: true,
    }),
  },
  async run(context) {
    const { auth, propsValue } = context;

    const response = await makeHousecallProRequest(
      auth,
      `/leads/${propsValue['id']}`,
      HttpMethod.GET
    );

    return response.body;
  },
});
