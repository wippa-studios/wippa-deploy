import { PieceAuth } from '@wippa/connectors-framework';

export const pdfCoAuth = PieceAuth.SecretText({
	displayName: 'API Key',
	description: `To get your PDF.co API key please [click here to create your account](https://app.pdf.co/).`,
	required: true,
});
