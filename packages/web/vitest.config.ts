import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@wippa/shared': path.resolve(
        __dirname,
        '../../packages/core/shared/src',
      ),
      '@wippa/connectors-framework': path.resolve(
        __dirname,
        '../../packages/pieces/framework/src',
      ),
      '@wippa/core-utils': path.resolve(
        __dirname,
        '../../packages/core/utils/src',
      ),
      '@wippa/core-formula': path.resolve(
        __dirname,
        '../../packages/core/formula/src',
      ),
      '@wippa/core-connector-types': path.resolve(
        __dirname,
        '../../packages/core/piece-types/src',
      ),
      '@wippa/core-execution': path.resolve(
        __dirname,
        '../../packages/core/execution/src',
      ),
    },
  },
});
