import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to handle SPA routing
const spaFallbackPlugin = () => {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // If the request is for an asset (has file extension), let it pass through
        if (req.url?.includes('.') || req.url?.startsWith('/api')) {
          return next()
        }
        
        // For all other requests (routes), serve index.html
        if (req.url && !req.url.includes('.')) {
          req.url = '/index.html'
        }
        next()
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallbackPlugin()],
  server: {
    port: 3000,
    host: true,
    open: true,
    // Vite automatically handles SPA routing, but we can ensure it works properly
    fs: {
      strict: false
    },
    // Custom middleware to handle SPA routing
    middlewareMode: false,
    // Ensure proper MIME types
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  preview: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // This ensures that all routes are served from index.html
  appType: 'spa',
  // Configure how Vite handles routing
  base: '/'
})
