import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/app/sdk/index.ts', '!src/test/**'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'dist',
  clean: true,
  minify: true,
  tsconfig: './tsconfig.json',
});
