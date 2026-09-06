import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/nvidia-api': {
        target: 'https://integrate.api.nvidia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/nvidia-api/, ''),
        secure: false, // Changed to false to avoid SSL handshake issues in local dev
        headers: {
          'Connection': 'keep-alive'
        }
      },
    },
  },
})