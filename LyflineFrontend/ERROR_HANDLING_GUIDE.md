# Error Handling & Debugging Guide

This guide explains all the error handling features built into the Lyfline frontend application and how to use them to debug issues.

## 🔍 Build-Time Error Handling

### 1. Automatic Build Validation

Run build validation to check for common issues:

```bash
# Validate existing build
npm run validate

# Build and validate in one step
npm run build:validate
```

#### What it checks:
- ✅ **Dist directory exists** - Build completed successfully
- ✅ **index.html exists** - Main HTML file was generated
- ✅ **React root element** - HTML contains `<div id="root">`
- ✅ **Script tags** - JavaScript bundles are referenced
- ✅ **_redirects file** - SPA routing configuration exists
- ✅ **Correct _redirects content** - File contains: `/*    /index.html   200`
- ✅ **Asset files** - CSS and JS files were generated
- ✅ **Package.json scripts** - Required scripts are configured
- ✅ **Vite configuration** - SPA plugins are properly set up

#### Example output:
```
🔍 Starting Build Validation...

✅ Info: 15
⚠️  Warnings: 0  
❌ Errors: 0

🎉 Build validation passed! Your app should deploy correctly.
```

### 2. Enhanced Vite Build Logging

During the build process, you'll see detailed logging:

```bash
🚀 Build started - copy-redirects plugin initialized
🔍 Starting _redirects file copy process...
📁 Source path: /path/to/public/_redirects
📁 Target path: /path/to/dist/_redirects
📄 Source file content: "/*    /index.html   200"
📄 Target file content: "/*    /index.html   200"
✅ SUCCESS: _redirects file copied successfully to dist directory
🏁 Build completed - copy-redirects plugin finished
```

#### Error indicators to watch for:
- ❌ `ERROR: Source _redirects file not found`
- ❌ `CRITICAL ERROR in copy-redirects plugin`
- ❌ `File content mismatch after copy`

## 🚨 Runtime Error Handling

### 1. Error Boundary

The app includes a React Error Boundary that catches JavaScript errors:

#### What it shows:
- **Error message** and timestamp
- **Current URL** where error occurred
- **Technical details** (expandable)
- **Action buttons** (Refresh Page, Go Home)

#### Console logging:
All errors are logged with detailed information:
```javascript
🚨 React Error Boundary Caught Error: {
  error: Error object,
  errorInfo: Component stack trace,
  timestamp: "2024-01-15T10:30:00.000Z",
  userAgent: "Browser info",
  url: "Current page URL"
}
```

### 2. Enhanced 404 Page

When accessing non-existent routes, you get a detailed 404 page:

#### Debug information shown:
- **Requested path** - The URL that was accessed
- **Full URL** - Complete URL with parameters
- **Timestamp** - When the 404 occurred
- **Referrer** - Where the user came from
- **Available routes** - List of valid routes

#### Console logging:
```javascript
🔍 404 Page Accessed: {
  path: "/invalid-route",
  fullUrl: "https://app.com/invalid-route",
  timestamp: "2024-01-15T10:30:00.000Z",
  referrer: "https://previous-page.com",
  userAgent: "Browser info"
}
```

### 3. App Initialization Logging

When the app starts, it logs initialization information:

```javascript
🚀 App Component Initialized: {
  timestamp: "2024-01-15T10:30:00.000Z",
  path: "/current-path",
  buildTime: "2024-01-15T10:00:00.000Z"
}
```

### 4. SPA Routing Logging

During development, route redirections are logged:

```javascript
🔄 SPA Fallback: Redirecting /signin to /index.html
```

## 🔧 Common Issues & Solutions

### Build Issues

#### ❌ "dist directory not found"
**Cause**: Build command failed
**Solution**:
1. Check for TypeScript/ESLint errors
2. Run: `npm run build` 
3. Check console for error messages

#### ❌ "_redirects file not found in dist"
**Cause**: Copy plugin failed or source file missing
**Solution**:
1. Ensure `public/_redirects` exists
2. Content should be: `/*    /index.html   200`
3. Check vite.config.js has `copyRedirectsPlugin()`

#### ❌ "_redirects content incorrect"
**Cause**: File has wrong content
**Solution**: Update `public/_redirects` to contain exactly:
```
/*    /index.html   200
```

### Runtime Issues

#### 🚨 React Error Boundary Triggered
**Solution**:
1. Check browser console for detailed error
2. Note the component stack trace
3. Check for missing imports or prop issues
4. Use "Show Technical Details" for stack trace

#### 🔍 404 Errors in Production
**Solution**:
1. Check if `_redirects` file exists in deployed site
2. Visit: `https://your-app.com/_redirects`
3. Should show: `/*    /index.html   200`
4. If missing, redeploy with correct build command

#### ⚡ Routes work locally but not in production
**Cause**: Server not configured for SPA routing
**Solution**:
1. Verify build includes `_redirects` file
2. Check hosting provider supports SPA routing
3. For Render: Use Static Site deployment type

## 📊 Debugging Workflow

### Step 1: Check Build
```bash
npm run build:validate
```

### Step 2: Local Testing
```bash
npm run preview
# Test routes: /signin, /register, /doctor-dashboard/123
```

### Step 3: Check Browser Console
- Look for error messages
- Check network tab for failed requests
- Note any 404 errors

### Step 4: Production Debugging
1. **Test _redirects file**: Visit `https://your-app.com/_redirects`
2. **Check 404 page**: Access invalid route to see debug info
3. **Monitor console**: Check for runtime errors

## 🛠️ Debug Tools Available

### Console Commands
```javascript
// Check if app is running in development
console.log('Development:', import.meta.env.DEV);

// Check build time
console.log('Build time:', __BUILD_TIME__);

// Check current route
console.log('Current path:', window.location.pathname);
```

### Environment Variables
```bash
# Check API URL
echo $VITE_API_BASE_URL

# In browser console
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
```

## 📞 Getting Help

If you're still having issues:

1. **Run validation**: `npm run build:validate`
2. **Check console logs** for detailed error messages
3. **Note the exact error messages** with timestamps
4. **Include browser information** (Chrome, Firefox, etc.)
5. **Share the validation output** if seeking help

The comprehensive error handling ensures you have all the information needed to debug any issues quickly and effectively. 