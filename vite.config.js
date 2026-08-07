import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // any fetch('/api/...') from React gets forwarded to the backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // same thing for auth routes (signin, signout)
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})