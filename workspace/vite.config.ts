import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './canvases/default/src'),
      '@studio': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
      host: 'live-preview.joyverse.fun',
    },
    allowedHosts: true,
    watch: {
      usePolling: true,
    },
    fs: {
      allow: [__dirname],
    },
    proxy: {
      '/api': {
        target: 'http://livepreview_api:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://livepreview_api:8000',
        ws: true,
      },
    },
  },
})