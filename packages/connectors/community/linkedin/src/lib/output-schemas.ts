import { OutputSchema } from '@wippa/connectors-framework';

export const createShareUpdateActionOutputSchema: OutputSchema = {
  fields: [
    {
      key: 'success',
      label: 'Success',
      value: 'success',
      format: 'boolean',
    },
  ],
};

export const createCompanyUpdateActionOutputSchema: OutputSchema = {
  fields: [
    {
      key: 'success',
      label: 'Success',
      value: 'success',
      format: 'boolean',
    },
  ],
};
