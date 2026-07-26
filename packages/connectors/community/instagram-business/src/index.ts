import { createConnector } from '@wippa/connectors-framework';
import { PieceCategory } from '@wippa/connectors-framework';
import { uploadPhoto } from './lib/actions/upload-photo';
import { uploadReel } from './lib/actions/upload-reel';
import { instagramCommon } from './lib/common';

export const instagramBusiness = createConnector({
  displayName: 'Instagram for Business',
  description: 'Grow your business on Instagram',
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/instagram.png',
  categories: [PieceCategory.BUSINESS_INTELLIGENCE],
  authors: ["kishanprmr","MoShizzle","abuaboud"],
  auth: instagramCommon.authentication,
  actions: [uploadPhoto, uploadReel],
  triggers: [],
});
