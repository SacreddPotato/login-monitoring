import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // In development, send API calls to the Express server.
    proxy: { '/api': 'http://localhost:3000' },
  },
});
