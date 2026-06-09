import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        'portfolio-monte-carlo': 'portfolio-monte-carlo.html',
      },
    },
  },
});
