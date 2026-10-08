import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Serve canvas piece sources directly so dynamic import + fetch work reliably
// through the nginx proxy (no /@fs ambiguity).
function canvasStatic(): Plugin {
  return {
    name: 'canvas-static',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/canvases/')) return next()
        const filePath = path.join(__dirname, req.url.split('?')[0])
        if (!filePath.startsWith(path.join(__dirname, 'canvases'))) { res.statusCode = 403; return res.end('forbidden') }
        fs.readFile(filePath, (err, data) => {
          if (err) { res.statusCode = 404; return res.end('not found') }
          const ext = path.extname(filePath)
          const type = ext === '.html' ? 'text/html' : ext === '.css' ? 'text/css' : 'text/plain'
          res.setHeader('Content-Type', type)
          res.end(data)
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), canvasStatic()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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