import { defineConfig } from 'vite';
import { sharedConfig } from './vite.config';
import { isDev, r } from './scripts/utils';
import packageJson from './package.json';

export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: r('extension/dist/contentScripts'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: r('src/contentScripts/main.tsx'),
      name: packageJson.name,
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.global.js',
        assetFileNames: 'index.global[extname]',
        extend: true,
      },
    },
  },
  plugins: [...sharedConfig.plugins!],
});
