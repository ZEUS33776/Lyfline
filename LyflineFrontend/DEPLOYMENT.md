# Deployment Guide for Render

## Frontend Deployment

### 1. Render Dashboard Configuration
When creating a new Static Site in Render dashboard, use these settings:

**Build Settings:**
- **Build Command**: `npm ci && npm run build:validate`
- **Publish Directory**: `dist`
- **Auto-Deploy**: Yes

**Advanced Settings:**
- **Node Version**: 18 (or latest LTS)

### 2. Environment Variables
Set the following environment variable in your Render dashboard:

```
VITE_API_BASE_URL=https://your-backend-service.onrender.com
```

### 3. Static Site Configuration
The following files are configured for SPA routing:
- `public/_redirects` - Fallback routing for all routes to index.html (copied to dist during build)
- `vite.config.js` - Development server SPA routing + build-time _redirects copying

### 4. Error Handling & Debugging Features

#### 4.1 Build Validation
The project includes comprehensive build validation:
```bash
# Validate existing build
npm run validate

# Build and validate in one command
npm run build:validate
```

The validation script checks for:
- ✅ Dist directory exists
- ✅ index.html exists and contains React root
- ✅ _redirects file exists with correct content
- ✅ Asset files (CSS/JS) are generated
- ✅ Package.json scripts are configured
- ✅ Vite configuration includes SPA plugins

#### 4.2 Enhanced Build Logging
The Vite build process now includes detailed logging:
- 🔍 _redirects file copy process with source/target verification
- 📄 File content validation
- ❌ Detailed error messages with troubleshooting hints
- 🚀 Build start/end notifications

#### 4.3 Runtime Error Handling
The React app includes:
- **Error Boundary**: Catches and displays React errors with stack traces
- **Enhanced 404 Page**: Shows debug information for unmatched routes
- **Console Logging**: Detailed route access logging for debugging

### 5. Routing Fix Applied
The routing issue has been fixed with:
1. **Custom Vite plugin** for SPA fallback in development
2. **Automatic _redirects file copying** to dist directory during build
3. **Proper _redirects format** for static site hosting
4. **Manual Render configuration** (no render.yaml file needed)
5. **Comprehensive error handling** throughout the build process

### 6. Testing Locally
Run the following commands to test locally:
```bash
# Development server with error handling
npm start
# or
npm run dev

# Build and validate
npm run build:validate

# Preview production build
npm run preview
```

Test routes directly:
- http://localhost:3000/signin
- http://localhost:3000/register
- http://localhost:3000/doctor-dashboard/123

All routes should now work when accessed directly via URL.

### 7. Production Deployment Steps

1. **Test locally first:**
   ```bash
   npm run build:validate
   ```
   Ensure this passes before deploying.

2. **Push your code to GitHub**

3. **In Render Dashboard:**
   - Go to https://render.com
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure the build settings as shown above
   - Add the environment variable
   - Deploy

4. **Monitor the build logs:**
   - Look for: `✅ SUCCESS: _redirects file copied successfully to dist directory`
   - Check for any ❌ error messages

### 8. Debugging Failed Deployments

#### 8.1 Build Logs Analysis
In Render, check the "Events" tab for these messages:

**✅ Success indicators:**
- `🚀 Build started - copy-redirects plugin initialized`
- `✅ SUCCESS: _redirects file copied successfully to dist directory`
- `🏁 Build completed - copy-redirects plugin finished`

**❌ Error indicators:**
- `❌ ERROR: Source _redirects file not found`
- `❌ CRITICAL ERROR in copy-redirects plugin`
- Build validation failures

#### 8.2 Runtime Debugging
If routes don't work after deployment:

1. **Check browser console** for detailed error logs
2. **Visit the 404 page** - it shows debug information
3. **Test the _redirects file** by visiting `https://your-app.onrender.com/_redirects`

#### 8.3 Common Error Messages

**"Source _redirects file not found"**
- Solution: Ensure `public/_redirects` file exists
- Content should be: `/*    /index.html   200`

**"File content mismatch after copy"**
- Solution: Check file permissions and content encoding

**"Dist directory not found"**
- Solution: Build command may have failed, check earlier build logs

### 9. Common Issues & Solutions

**If you still get 404 errors:**
1. Run `npm run build:validate` locally to check for issues
2. Verify the `_redirects` file exists in the `dist` folder after build
3. Check that Render is using the correct publish directory (`dist`)
4. Ensure the build command completed successfully without errors
5. Check browser developer tools for any console errors

**If build validation fails:**
1. Check the detailed error messages in the validation output
2. Follow the suggested fixes provided by the validation script
3. Ensure all required files exist in the correct locations

The comprehensive error handling ensures you'll get detailed information about any issues that occur during build or runtime, making debugging much easier. 