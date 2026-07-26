import { stripHtml } from 'string-strip-html';
import { createAction, Property } from '@wippa/connectors-framework';

export const stripHtmlContent = createAction({
  audience: 'human',
  name: 'stripHtml',
  displayName: 'Remove HTML Tags',
  description: 'Removes every HTML tag and returns plain text',
  props: {
    html: Property.LongText({
      displayName: 'HTML content',
      required: true,
    }),
  },
  async run({ propsValue }) {
    return stripHtml(propsValue.html).result;
  },
});
