import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  envPrefix: 'VITE_',
  plugins: [react()],
  server: { port: 5173, open: true },
  build: { sourcemap: true, target: 'esnext' },
  define: { 'process.env': process.env },
});
