# Render SPA Routing Troubleshooting Guide

## Issue: 404 Error on Direct Route Access

If you're getting 404 errors when accessing routes like `/signin` directly on your Render deployment, follow these steps:

## ✅ Step 1: Verify Your Render Configuration

In your Render dashboard, ensure these settings:

**Static Site Settings:**
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**: 
  ```
  VITE_API_BASE_URL=https://your-backend-url.onrender.com
  ```

## ✅ Step 2: Check Build Logs

1. Go to your Render dashboard
2. Click on your deployed service
3. Check the "Events" tab for build logs
4. Look for the line: `✓ Copied _redirects file to dist directory`

If you don't see this line, the build failed to copy the redirects file.

## ✅ Step 3: Verify _redirects File

After deployment, check if the `_redirects` file exists in your deployed site:
- Visit: `https://your-app.onrender.com/_redirects`
- It should show: `/*    /index.html   200`

## ✅ Step 4: Force Redeploy

If the redirects file is missing:
1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Watch the build logs for the copy message

## ✅ Step 5: Alternative Solution

If the above doesn't work, try this manual fix:

1. **Create a new file** in your project: `public/200.html`
2. **Copy the contents** of `dist/index.html` into this file
3. **Redeploy**

Some hosting services look for `200.html` instead of using `_redirects`.

## ✅ Step 6: Test the Fix

After deployment, test these URLs directly in your browser:
- `https://your-app.onrender.com/signin`
- `https://your-app.onrender.com/register`
- `https://your-app.onrender.com/doctor-dashboard/123`

All should load the React app instead of showing 404.

## 🔧 Additional Debugging

If still getting 404s:

1. **Check browser developer tools:**
   - Network tab for failed requests
   - Console for JavaScript errors

2. **Verify the app loads on the homepage:**
   - Does `https://your-app.onrender.com/` work?
   - Can you navigate using the app's internal links?

3. **Check file structure in deployed site:**
   - Ensure `index.html` exists in the root
   - Ensure `_redirects` file exists in the root

## 📞 Need Help?

If you're still having issues:
1. Check the build was successful (no errors in Render logs)
2. Verify the publish directory is set to `dist`
3. Ensure you're using a **Static Site** deployment type in Render

The configuration in this repository should work with Render's static site hosting. The key is ensuring the `_redirects` file is properly copied to the `dist` directory during build. 