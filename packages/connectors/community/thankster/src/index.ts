
    import { createConnector, PieceAuth } from "@wippa/connectors-framework";
    import { sendCards } from './lib/actions/send-cards';

    export const thanksterAuth = PieceAuth.SecretText({
      displayName: 'API Key',
      required: true,
      description: 'Go My Profile page to find your API Key at the bottom.',
    });

    export const thankster = createConnector({
      displayName: "Thankster",
      auth: thanksterAuth,
      minimumSupportedRelease: '0.36.1',
      logoUrl: "https://cdn.activepieces.com/pieces/thankster.png",
      authors: [],
      actions: [sendCards],
      triggers: [],
    });
    