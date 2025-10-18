import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

//*const API_URL = 'https://api.notehub.io/v1'; */

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    sourcemap: true,
  }
})
