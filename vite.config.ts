import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
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
});
