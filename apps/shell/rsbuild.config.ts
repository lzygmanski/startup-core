import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  resolve: {
    alias: {
      '@shared/ui': new URL('../../libs/shared/ui/src/index.ts', import.meta.url).pathname,
    },
  },
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  html: {
    template: './src/index.html',
    title: 'Startup Core',
  },
  output: {
    distPath: {
      root: '../../dist/apps/shell',
    },
    cleanDistPath: true,
  },
});
