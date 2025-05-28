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

// Enhanced plugin to create multiple SPA routing solutions
const multipleRoutingFilesPlugin = () => {
  return {
    name: 'multiple-routing-files',
    writeBundle() {
      const timestamp = new Date().toISOString()
      try {
        console.log(`🔍 [${timestamp}] Creating multiple SPA routing solutions...`)
        
        const distPath = path.resolve('dist')
        const publicPath = path.resolve('public')
        
        // Ensure dist directory exists
        if (!fs.existsSync(distPath)) {
          console.error(`❌ [${timestamp}] CRITICAL: Dist directory not found`)
          return
        }

        // Read index.html content for fallback pages
        const indexPath = path.join(distPath, 'index.html')
        let indexContent = ''
        if (fs.existsSync(indexPath)) {
          indexContent = fs.readFileSync(indexPath, 'utf8')
          console.log(`📄 [${timestamp}] Read index.html content (${indexContent.length} chars)`)
        }

        // Solution 1: _redirects file (Netlify/Render style)
        const redirectsContent = '/*    /index.html   200'
        const redirectsSource = path.join(publicPath, '_redirects')
        const redirectsTarget = path.join(distPath, '_redirects')
        
        try {
          // Ensure source exists
          if (!fs.existsSync(redirectsSource)) {
            fs.writeFileSync(redirectsSource, redirectsContent)
            console.log(`✅ [${timestamp}] AUTO-CREATED: public/_redirects`)
          }
          
          // Copy to dist
          fs.writeFileSync(redirectsTarget, redirectsContent)
          console.log(`✅ [${timestamp}] CREATED: dist/_redirects`)
        } catch (error) {
          console.error(`❌ [${timestamp}] Failed to create _redirects:`, error.message)
        }

        // Solution 2: 200.html file (alternative fallback)
        try {
          const fallback200Path = path.join(distPath, '200.html')
          fs.writeFileSync(fallback200Path, indexContent)
          console.log(`✅ [${timestamp}] CREATED: dist/200.html`)
        } catch (error) {
          console.error(`❌ [${timestamp}] Failed to create 200.html:`, error.message)
        }

        // Solution 3: 404.html file (GitHub Pages style)
        try {
          const fallback404Path = path.join(distPath, '404.html')
          fs.writeFileSync(fallback404Path, indexContent)
          console.log(`✅ [${timestamp}] CREATED: dist/404.html`)
        } catch (error) {
          console.error(`❌ [${timestamp}] Failed to create 404.html:`, error.message)
        }

        // Solution 4: vercel.json
        try {
          const vercelConfig = {
            "rewrites": [
              { "source": "/(.*)", "destination": "/index.html" }
            ]
          }
          const vercelPath = path.join(distPath, 'vercel.json')
          fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2))
          console.log(`✅ [${timestamp}] CREATED: dist/vercel.json`)
        } catch (error) {
          console.error(`❌ [${timestamp}] Failed to create vercel.json:`, error.message)
        }

        // Solution 5: netlify.toml
        try {
          const netlifyConfig = `[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`
          const netlifyPath = path.join(distPath, 'netlify.toml')
          fs.writeFileSync(netlifyPath, netlifyConfig)
          console.log(`✅ [${timestamp}] CREATED: dist/netlify.toml`)
        } catch (error) {
          console.error(`❌ [${timestamp}] Failed to create netlify.toml:`, error.message)
        }

        // Solution 6: Static route files for common routes
        const commonRoutes = ['signin', 'register', 'admin-dashboard', 'doctor-dashboard', 'receptionist-dashboard', 'pathologist-dashboard']
        
        commonRoutes.forEach(route => {
          try {
            const routeDir = path.join(distPath, route)
            if (!fs.existsSync(routeDir)) {
              fs.mkdirSync(routeDir, { recursive: true })
            }
            const routeIndexPath = path.join(routeDir, 'index.html')
            fs.writeFileSync(routeIndexPath, indexContent)
            console.log(`✅ [${timestamp}] CREATED: dist/${route}/index.html`)
          } catch (error) {
            console.error(`❌ [${timestamp}] Failed to create ${route}/index.html:`, error.message)
          }
        })

        // Verification
        console.log(`\n📦 [${timestamp}] ===== SPA ROUTING SOLUTIONS VERIFICATION =====`)
        const solutionFiles = ['_redirects', '200.html', '404.html', 'vercel.json', 'netlify.toml']
        solutionFiles.forEach(file => {
          const filePath = path.join(distPath, file)
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath)
            console.log(`✅ [${timestamp}] ${file} (${stats.size} bytes)`)
          } else {
            console.error(`❌ [${timestamp}] MISSING: ${file}`)
          }
        })

        // Check route directories
        commonRoutes.forEach(route => {
          const routeIndexPath = path.join(distPath, route, 'index.html')
          if (fs.existsSync(routeIndexPath)) {
            console.log(`✅ [${timestamp}] ${route}/index.html`)
          } else {
            console.error(`❌ [${timestamp}] MISSING: ${route}/index.html`)
          }
        })

        console.log(`📦 [${timestamp}] ===== END SPA ROUTING VERIFICATION =====\n`)
        console.log(`🎉 [${timestamp}] Multiple SPA routing solutions deployed! At least one should work.`)
        
      } catch (error) {
        console.error(`❌ [${timestamp}] CRITICAL ERROR in multiple-routing-files plugin:`)
        console.error(`❌ [${timestamp}] Error: ${error.message}`)
        console.error(`❌ [${timestamp}] Stack: ${error.stack}`)
      }
    },
    
    // Add build start logging
    buildStart() {
      const timestamp = new Date().toISOString()
      console.log(`🚀 [${timestamp}] BUILD STARTED - multiple-routing-files plugin initialized`)
      console.log(`🔧 [${timestamp}] Build environment: ${process.env.NODE_ENV || 'development'}`)
    },
    
    // Add build end logging
    buildEnd() {
      const timestamp = new Date().toISOString()
      console.log(`🏁 [${timestamp}] BUILD COMPLETED - multiple-routing-files plugin finished`)
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
      console.log(`\n📦 [${timestamp}] ===== FINAL BUILD OUTPUT VERIFICATION =====`)
      
      try {
        const distPath = path.resolve('dist')
        const distContents = fs.readdirSync(distPath, { withFileTypes: true })
        console.log(`📁 [${timestamp}] Dist directory contents:`)
        
        distContents.forEach(item => {
          const itemPath = path.join(distPath, item.name)
          if (item.isDirectory()) {
            console.log(`   📁 [${timestamp}] ${item.name}/ (DIR)`)
            // Show contents of route directories
            try {
              const subContents = fs.readdirSync(itemPath)
              subContents.forEach(subItem => {
                console.log(`      📄 [${timestamp}] ${item.name}/${subItem}`)
              })
            } catch (e) {
              // Ignore if can't read subdirectory
            }
          } else {
            const stats = fs.statSync(itemPath)
            console.log(`   📄 [${timestamp}] ${item.name} (${stats.size} bytes)`)
          }
        })
        
        // Check for all SPA routing solutions
        const requiredFiles = ['index.html', '_redirects', '200.html', '404.html']
        console.log(`\n🔍 [${timestamp}] Checking critical SPA routing files:`)
        requiredFiles.forEach(file => {
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
      
      console.log(`📦 [${timestamp}] ===== END FINAL BUILD VERIFICATION =====\n`)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallbackPlugin(), multipleRoutingFilesPlugin(), deploymentLoggingPlugin()],
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
