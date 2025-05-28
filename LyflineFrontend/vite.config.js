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
          // Log all requests for debugging
          console.log(`🌐 [${new Date().toISOString()}] REQUEST: ${req.method} ${req.url}`)
          
          // If the request is for an asset (has file extension), let it pass through
          if (req.url?.includes('.') || req.url?.startsWith('/api')) {
            console.log(`📁 [${new Date().toISOString()}] ASSET REQUEST: ${req.url}`)
            return next()
          }
          
          // For all other requests (routes), serve index.html
          if (req.url && !req.url.includes('.')) {
            console.log(`🔄 [${new Date().toISOString()}] SPA FALLBACK: Redirecting ${req.url} to /index.html`)
            req.url = '/index.html'
          }
          next()
        } catch (error) {
          console.error(`❌ [${new Date().toISOString()}] SPA FALLBACK ERROR:`, {
            error: error.message,
            stack: error.stack,
            originalUrl: req.url,
            method: req.method
          })
          next(error)
        }
      })
    }
  }
}

// Plugin to copy _redirects file to dist directory with comprehensive logging
const copyRedirectsPlugin = () => {
  return {
    name: 'copy-redirects',
    writeBundle() {
      const timestamp = new Date().toISOString()
      try {
        console.log(`🔍 [${timestamp}] Starting _redirects file copy process...`)
        
        // Define source and target paths
        const redirectsSource = path.resolve('public', '_redirects')
        const redirectsTarget = path.resolve('dist', '_redirects')
        
        console.log(`📁 [${timestamp}] Source path: ${redirectsSource}`)
        console.log(`📁 [${timestamp}] Target path: ${redirectsTarget}`)
        
        // Check if source file exists
        if (!fs.existsSync(redirectsSource)) {
          console.error(`❌ [${timestamp}] CRITICAL: Source _redirects file not found at: ${redirectsSource}`)
          console.error(`❌ [${timestamp}] This will cause 404 errors in production!`)
          console.log(`💡 [${timestamp}] Create public/_redirects file with content: /*    /index.html   200`)
          
          // Try to create the file automatically
          try {
            fs.writeFileSync(redirectsSource, '/*    /index.html   200')
            console.log(`✅ [${timestamp}] AUTO-CREATED: _redirects file created automatically`)
          } catch (createError) {
            console.error(`❌ [${timestamp}] FAILED to auto-create _redirects file:`, createError.message)
            return
          }
        }
        
        // Read source file content for verification
        const sourceContent = fs.readFileSync(redirectsSource, 'utf8')
        console.log(`📄 [${timestamp}] Source file content: "${sourceContent.trim()}"`)
        
        // Check if dist directory exists
        const distDir = path.resolve('dist')
        if (!fs.existsSync(distDir)) {
          console.error(`❌ [${timestamp}] CRITICAL: Dist directory not found at: ${distDir}`)
          console.error(`❌ [${timestamp}] Build may have failed!`)
          return
        }
        
        // Copy the file
        fs.copyFileSync(redirectsSource, redirectsTarget)
        console.log(`📋 [${timestamp}] File copy operation completed`)
        
        // Verify the copy was successful
        if (fs.existsSync(redirectsTarget)) {
          const targetContent = fs.readFileSync(redirectsTarget, 'utf8')
          console.log(`📄 [${timestamp}] Target file content: "${targetContent.trim()}"`)
          
          if (sourceContent === targetContent) {
            console.log(`✅ [${timestamp}] SUCCESS: _redirects file copied successfully to dist directory`)
            console.log(`🎉 [${timestamp}] SPA routing should work in production!`)
          } else {
            console.error(`❌ [${timestamp}] ERROR: File content mismatch after copy`)
            console.error(`❌ [${timestamp}] Expected: "${sourceContent.trim()}"`)
            console.error(`❌ [${timestamp}] Got: "${targetContent.trim()}"`)
          }
        } else {
          console.error(`❌ [${timestamp}] CRITICAL: Failed to copy _redirects file - target file does not exist`)
          console.error(`❌ [${timestamp}] This WILL cause 404 errors in production!`)
        }
        
      } catch (error) {
        console.error(`❌ [${timestamp}] CRITICAL ERROR in copy-redirects plugin:`)
        console.error(`❌ [${timestamp}] Error message: ${error.message}`)
        console.error(`❌ [${timestamp}] Error code: ${error.code}`)
        console.error(`❌ [${timestamp}] Error path: ${error.path}`)
        console.error(`❌ [${timestamp}] Full error:`, error)
        
        // Don't fail the build, but make the error very visible
        console.log(`\n🚨 [${timestamp}] ===== BUILD WILL CONTINUE BUT SPA ROUTING MAY NOT WORK =====`)
        console.log(`🔧 [${timestamp}] Manual fix: Create dist/_redirects file with content: /*    /index.html   200`)
        console.log(`🚨 [${timestamp}] ===== CHECK RENDER LOGS FOR THIS ERROR =====\n`)
      }
    },
    
    // Add build start logging
    buildStart() {
      const timestamp = new Date().toISOString()
      console.log(`🚀 [${timestamp}] BUILD STARTED - copy-redirects plugin initialized`)
      console.log(`🔧 [${timestamp}] Build environment: ${process.env.NODE_ENV || 'development'}`)
    },
    
    // Add build end logging
    buildEnd() {
      const timestamp = new Date().toISOString()
      console.log(`🏁 [${timestamp}] BUILD COMPLETED - copy-redirects plugin finished`)
    }
  }
}

// Add deployment environment logging
const deploymentLoggingPlugin = () => {
  return {
    name: 'deployment-logging',
    buildStart() {
      const timestamp = new Date().toISOString()
      console.log(`\n🌍 [${timestamp}] ===== DEPLOYMENT ENVIRONMENT INFO =====`)
      console.log(`📅 [${timestamp}] Build timestamp: ${timestamp}`)
      console.log(`🖥️  [${timestamp}] Node version: ${process.version}`)
      console.log(`🌐 [${timestamp}] Platform: ${process.platform}`)
      console.log(`📁 [${timestamp}] Working directory: ${process.cwd()}`)
      console.log(`🔧 [${timestamp}] Environment: ${process.env.NODE_ENV || 'not set'}`)
      console.log(`🔗 [${timestamp}] API URL: ${process.env.VITE_API_BASE_URL || 'not set'}`)
      console.log(`🌍 [${timestamp}] ===== END ENVIRONMENT INFO =====\n`)
    },
    
    writeBundle() {
      const timestamp = new Date().toISOString()
      console.log(`\n📦 [${timestamp}] ===== BUILD OUTPUT VERIFICATION =====`)
      
      try {
        const distPath = path.resolve('dist')
        const distContents = fs.readdirSync(distPath)
        console.log(`📁 [${timestamp}] Dist directory contents:`)
        distContents.forEach(file => {
          const filePath = path.join(distPath, file)
          const stats = fs.statSync(filePath)
          console.log(`   📄 [${timestamp}] ${file} (${stats.isDirectory() ? 'DIR' : 'FILE'}, ${stats.size} bytes)`)
        })
        
        // Check specifically for critical files
        const criticalFiles = ['index.html', '_redirects']
        criticalFiles.forEach(file => {
          const filePath = path.join(distPath, file)
          if (fs.existsSync(filePath)) {
            console.log(`✅ [${timestamp}] CRITICAL FILE OK: ${file}`)
          } else {
            console.error(`❌ [${timestamp}] CRITICAL FILE MISSING: ${file}`)
          }
        })
        
      } catch (error) {
        console.error(`❌ [${timestamp}] Could not verify build output:`, error.message)
      }
      
      console.log(`📦 [${timestamp}] ===== END BUILD VERIFICATION =====\n`)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallbackPlugin(), copyRedirectsPlugin(), deploymentLoggingPlugin()],
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
