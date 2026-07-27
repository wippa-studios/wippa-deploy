import path from 'path'
import { defineConfig } from 'vitest/config'

const repoRoot = path.resolve(__dirname, '../../../..')

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@wippa/connectors-framework': path.resolve(repoRoot, 'packages/connectors/framework/src/index.ts'),
    },
  },
})
