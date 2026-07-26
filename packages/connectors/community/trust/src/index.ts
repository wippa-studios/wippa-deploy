import { createConnector } from '@wippa/connectors-framework';
import { createCustomApiCallAction } from '@wippa/connectors-common';
import { PieceCategory } from '@wippa/connectors-framework';
import { trustAuth } from './lib/auth';
import { createTestimonialAction } from './lib/actions/create-testimonial';
import { updateTestimonialAction } from './lib/actions/update-testimonial';
import { deleteTestimonialAction } from './lib/actions/delete-testimonial';
import { findTestimonialAction } from './lib/actions/find-testimonial';
import { createContactAction } from './lib/actions/create-contact';
import { updateContactAction } from './lib/actions/update-contact';
import { deleteContactAction } from './lib/actions/delete-contact';
import { findContactAction } from './lib/actions/find-contact';
import { uploadImageAction } from './lib/actions/upload-image';
import { uploadVideoAction } from './lib/actions/upload-video';
import { uploadSmallVideoAction } from './lib/actions/upload-small-video';
import { newTestimonialTrigger } from './lib/triggers/new-testimonial';

export const trust = createConnector({
  displayName: 'Trust',
  description: 'Collect and manage video and text testimonials from your customers.',
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/trust.png',
  categories: [PieceCategory.MARKETING],
  auth: trustAuth,
  authors: ['sanket-a11y'],
  actions: [
    createTestimonialAction,
    updateTestimonialAction,
    deleteTestimonialAction,
    findTestimonialAction,
    createContactAction,
    updateContactAction,
    deleteContactAction,
    findContactAction,
    uploadImageAction,
    uploadVideoAction,
    uploadSmallVideoAction,
    createCustomApiCallAction({
      baseUrl: () => 'https://api.usetrust.app/v1',
      auth: trustAuth,
      authMapping: async (auth) => ({
        Authorization: `Basic ${Buffer.from(`apikey:${auth.props.api_key}`).toString('base64')}`,
      }),
    }),
  ],
  triggers: [newTestimonialTrigger],
});
