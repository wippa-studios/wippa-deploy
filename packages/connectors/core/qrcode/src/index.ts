
    import { createConnector, PieceAuth } from "@wippa/connectors-framework";
    import { PieceCategory } from '@wippa/connectors-framework';
    import { outputQrcodeAction } from './lib/actions/output-qrcode-action'
    
    export const qrcode = createConnector({
      displayName: 'QR Code',
      auth: PieceAuth.None(),
      minimumSupportedRelease: '0.30.0',
      logoUrl: "https://cdn.activepieces.com/pieces/new-core/qrcode.svg",
      categories: [PieceCategory.CORE],
      authors: ['Meng-Yuan Huang'],
      actions: [
        outputQrcodeAction,
      ],
      triggers: [],
    });
    