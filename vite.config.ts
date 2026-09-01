import {defineConfig} from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  build: {
    target: 'es2022',
    sourcemap: false
  }
});
