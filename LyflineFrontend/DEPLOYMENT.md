# Deployment Guide for Render

## Frontend Deployment

### 1. Environment Variables
Set the following environment variable in your Render dashboard:

```
VITE_API_BASE_URL=https://your-backend-service.onrender.com
```

### 2. Build Settings
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Auto-Deploy**: Yes

### 3. Static Site Configuration
The following files are configured for SPA routing:
- `render.yaml` - Main Render configuration
- `public/_redirects` - Fallback routing for all routes to index.html
- `vite.config.js` - Development server SPA routing

### 4. Routing Fix
The routing issue has been fixed with:
1. Custom Vite plugin for SPA fallback
2. Proper `_redirects` file configuration
3. Render.yaml with route rewrites

### 5. Testing Locally
Run the following commands to test locally:
```bash
npm start
# or
npm run dev
```

Test routes directly:
- http://localhost:3000/signin
- http://localhost:3000/register
- http://localhost:3000/doctor-dashboard/123

All routes should now work when accessed directly via URL.

### 6. Production Deployment
1. Push your code to GitHub
2. Connect your repository to Render
3. Set the environment variables
4. Deploy as a Static Site

The `render.yaml` file will automatically configure the deployment settings. 