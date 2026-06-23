import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@core/application': new URL('../../libs/core/application/src/index.ts', import.meta.url)
        .pathname,
      '@core/contracts': new URL('../../libs/core/contracts/src/index.ts', import.meta.url)
        .pathname,
      '@core/domain': new URL('../../libs/core/domain/src/index.ts', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
  },
});
