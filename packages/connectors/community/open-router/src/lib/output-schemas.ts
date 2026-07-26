import { OutputSchema } from '@wippa/pieces-framework';

export const askLmmActionOutputSchema: OutputSchema = {
  fields: [
    {
      key: 'response',
      label: 'Response',
      value: '',
      description: 'The LLM\'s generated text response.',
    },
  ],
};
