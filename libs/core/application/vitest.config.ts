import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: new URL('.', import.meta.url).pathname,
  resolve: {
    alias: {
      '@core/contracts': new URL('../contracts/src/index.ts', import.meta.url).pathname,
      '@core/domain': new URL('../domain/src/index.ts', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
});
