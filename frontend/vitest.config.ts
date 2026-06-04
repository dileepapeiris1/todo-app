import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals:      true,
    environment:  'jsdom',
    setupFiles:   ['./src/__tests__/setup.ts'],
    css:          false,
    coverage: {
      reporter: ['text', 'html'],
      exclude:  ['src/test/**', '*.config.*', 'src/main.tsx'],
    },
  },
});
