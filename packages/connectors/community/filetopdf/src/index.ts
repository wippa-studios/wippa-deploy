import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { filetopdfAuth } from './lib/common/auth';
import { getAccount } from './lib/actions/get-account';
import { convertFile } from './lib/actions/convert-file';
import { convertHtml } from './lib/actions/convert-html';
import { convertMarkdown } from './lib/actions/convert-markdown';

export const filetopdf = createConnector({
  displayName: 'FileToPDF',
  description:
    'Convert files, HTML, and Markdown to PDF. Office documents (DOCX, XLSX, PPTX), images, web pages, and Markdown become clean PDFs over a simple API.',
  auth: filetopdfAuth,
  minimumSupportedRelease: '0.82.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/filetopdf.png',
  categories: [PieceCategory.CONTENT_AND_FILES, PieceCategory.PRODUCTIVITY],
  authors: ['FileToPDF'],
  actions: [convertFile, convertHtml, convertMarkdown, getAccount],
  triggers: [],
});
