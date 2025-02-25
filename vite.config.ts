import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      include: ['src/app/sdk/**/*.ts', 'src/entities/**/*.ts'],
      outDir: 'dist',
      rollupTypes: true,
      insertTypesEntry: true,
      bundledPackages: ['event-source-polyfill'],
      copyDtsFiles: true,
      staticImport: true,
    }),
  ],
  server: {
    proxy: {
      '/proxy': {
        target: 'https://payment.pay-200.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/proxy/, ''),
        secure: false,
        ws: true,
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/app/sdk/index.ts'),
      name: 'pay200SDK',
      fileName: (format) => `pay200-sdk.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    sourcemap: true,
    minify: 'terser',
  },
});
