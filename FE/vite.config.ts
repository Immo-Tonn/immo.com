import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import compression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig({
  plugins: [reactRouter(), compression()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@app': path.resolve(__dirname, 'src/app'),
    },
  },
});
