import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to handle SPA routing
const spaFallbackPlugin = () => {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          // If the request is for an asset (has file extension), let it pass through
          if (req.url?.includes('.') || req.url?.startsWith('/api')) {
            return next()
          }
          
          // For all other requests (routes), serve index.html
          if (req.url && !req.url.includes('.')) {
            console.log(`🔄 SPA Fallback: Redirecting ${req.url} to /index.html`)
            req.url = '/index.html'
          }
          next()
        } catch (error) {
          console.error('❌ SPA Fallback Plugin Error:', error)
          next(error)
        }
      })
    }
  }
}

// Plugin to copy _redirects file to dist directory with error handling
const copyRedirectsPlugin = () => {
  return {
    name: 'copy-redirects',
    writeBundle() {
      try {
        console.log('🔍 Starting _redirects file copy process...')
        
        // Define source and target paths
        const redirectsSource = path.resolve('public', '_redirects')
        const redirectsTarget = path.resolve('dist', '_redirects')
        
        console.log(`📁 Source path: ${redirectsSource}`)
        console.log(`📁 Target path: ${redirectsTarget}`)
        
        // Check if source file exists
        if (!fs.existsSync(redirectsSource)) {
          console.error(`❌ ERROR: Source _redirects file not found at: ${redirectsSource}`)
          console.log('💡 Please ensure public/_redirects file exists with content: /*    /index.html   200')
          return
        }
        
        // Read source file content for verification
        const sourceContent = fs.readFileSync(redirectsSource, 'utf8')
        console.log(`📄 Source file content: "${sourceContent.trim()}"`)
        
        // Check if dist directory exists
        const distDir = path.resolve('dist')
        if (!fs.existsSync(distDir)) {
          console.error(`❌ ERROR: Dist directory not found at: ${distDir}`)
          return
        }
        
        // Copy the file
        fs.copyFileSync(redirectsSource, redirectsTarget)
        
        // Verify the copy was successful
        if (fs.existsSync(redirectsTarget)) {
          const targetContent = fs.readFileSync(redirectsTarget, 'utf8')
          console.log(`📄 Target file content: "${targetContent.trim()}"`)
          
          if (sourceContent === targetContent) {
            console.log('✅ SUCCESS: _redirects file copied successfully to dist directory')
          } else {
            console.error('❌ ERROR: File content mismatch after copy')
          }
        } else {
          console.error('❌ ERROR: Failed to copy _redirects file - target file does not exist')
        }
        
      } catch (error) {
        console.error('❌ CRITICAL ERROR in copy-redirects plugin:', error)
        console.error('📋 Error details:', {
          message: error.message,
          code: error.code,
          path: error.path,
          stack: error.stack
        })
        
        // Don't fail the build, but make the error very visible
        console.log('\n🚨 BUILD WILL CONTINUE BUT SPA ROUTING MAY NOT WORK 🚨')
        console.log('🔧 Manual fix: Create dist/_redirects file with content: /*    /index.html   200')
      }
    },
    
    // Add build start logging
    buildStart() {
      console.log('🚀 Build started - copy-redirects plugin initialized')
    },
    
    // Add build end logging
    buildEnd() {
      console.log('🏁 Build completed - copy-redirects plugin finished')
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallbackPlugin(), copyRedirectsPlugin()],
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
    },
    // Add build error handling
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    // Log build info
    logLevel: 'info'
  },
  // This ensures that all routes are served from index.html
  appType: 'spa',
  // Configure how Vite handles routing
  base: '/',
  // Add error handling for the entire config
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
})
