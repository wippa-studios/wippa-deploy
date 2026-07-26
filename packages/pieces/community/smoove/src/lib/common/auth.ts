import { PieceAuth, Property } from "@wippa/pieces-framework";
import { makeRequest } from "./client";
import { HttpMethod } from "@wippa/pieces-common";

export const smooveAuth = PieceAuth.SecretText({
    displayName: 'smoove API Key',
    required: true,
    validate: async ({ auth }) => {
        if (auth) {
            try {
                await makeRequest(auth as string, HttpMethod.GET, '/Lists', {});
                return {
                    valid: true,
                }
            } catch (error) {
                return {
                    valid: false,
                    error: 'Invalid Api Key'
                }
            }

        }
        return {
            valid: false,
            error: 'Invalid Api Key'
        }

    },

})