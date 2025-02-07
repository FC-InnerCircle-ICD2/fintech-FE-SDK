import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/app/sdk/index.ts', '!src/test/**'],
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'dist',
  clean: true,
  minify: true,
  treeshake: true,
  sourcemap: true,
  external: ['ky', 'qrcode'],
  tsconfig: './tsconfig.json',
});
