#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Starting Build Validation...\n');

const errors = [];
const warnings = [];
const info = [];

// Check if dist directory exists
const distPath = path.resolve(path.dirname(__dirname), 'dist');
if (!fs.existsSync(distPath)) {
  errors.push('❌ dist directory not found - build may have failed');
} else {
  info.push('✅ dist directory found');
}

// Check if index.html exists in dist
const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  errors.push('❌ index.html not found in dist directory');
} else {
  info.push('✅ index.html found in dist');
  
  // Check index.html content
  try {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (!indexContent.includes('<div id="root">')) {
      warnings.push('⚠️ index.html may not contain React root element');
    } else {
      info.push('✅ React root element found in index.html');
    }
    
    if (!indexContent.includes('src=')) {
      warnings.push('⚠️ No script tags found in index.html');
    } else {
      info.push('✅ Script tags found in index.html');
    }
  } catch (error) {
    warnings.push(`⚠️ Could not read index.html: ${error.message}`);
  }
}

// Check if _redirects file exists in dist
const redirectsPath = path.join(distPath, '_redirects');
if (!fs.existsSync(redirectsPath)) {
  errors.push('❌ _redirects file not found in dist directory - SPA routing will fail');
} else {
  info.push('✅ _redirects file found in dist');
  
  // Check _redirects content
  try {
    const redirectsContent = fs.readFileSync(redirectsPath, 'utf8').trim();
    const expectedContent = '/*    /index.html   200';
    
    if (redirectsContent !== expectedContent) {
      errors.push(`❌ _redirects content incorrect. Expected: "${expectedContent}", Found: "${redirectsContent}"`);
    } else {
      info.push('✅ _redirects file content is correct');
    }
  } catch (error) {
    warnings.push(`⚠️ Could not read _redirects file: ${error.message}`);
  }
}

// Check if source _redirects file exists in public
const sourceRedirectsPath = path.resolve(path.dirname(__dirname), 'public', '_redirects');
if (!fs.existsSync(sourceRedirectsPath)) {
  warnings.push('⚠️ Source _redirects file not found in public directory');
} else {
  info.push('✅ Source _redirects file found in public');
}

// Check for common asset files
const assetsPath = path.join(distPath, 'assets');
if (!fs.existsSync(assetsPath)) {
  warnings.push('⚠️ assets directory not found in dist');
} else {
  info.push('✅ assets directory found in dist');
  
  // Check for CSS and JS files
  try {
    const assetFiles = fs.readdirSync(assetsPath);
    const cssFiles = assetFiles.filter(file => file.endsWith('.css'));
    const jsFiles = assetFiles.filter(file => file.endsWith('.js'));
    
    if (cssFiles.length === 0) {
      warnings.push('⚠️ No CSS files found in assets');
    } else {
      info.push(`✅ Found ${cssFiles.length} CSS file(s)`);
    }
    
    if (jsFiles.length === 0) {
      warnings.push('⚠️ No JS files found in assets');
    } else {
      info.push(`✅ Found ${jsFiles.length} JS file(s)`);
    }
  } catch (error) {
    warnings.push(`⚠️ Could not read assets directory: ${error.message}`);
  }
}

// Check package.json scripts
const packageJsonPath = path.resolve(path.dirname(__dirname), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts || !packageJson.scripts.build) {
      warnings.push('⚠️ No build script found in package.json');
    } else {
      info.push('✅ Build script found in package.json');
    }
    
    if (!packageJson.scripts.start) {
      warnings.push('⚠️ No start script found in package.json');
    } else {
      info.push('✅ Start script found in package.json');
    }
  } catch (error) {
    warnings.push(`⚠️ Could not read package.json: ${error.message}`);
  }
}

// Check vite.config.js
const viteConfigPath = path.resolve(path.dirname(__dirname), 'vite.config.js');
if (!fs.existsSync(viteConfigPath)) {
  warnings.push('⚠️ vite.config.js not found');
} else {
  info.push('✅ vite.config.js found');
  
  try {
    const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
    if (!viteConfig.includes('copy-redirects')) {
      warnings.push('⚠️ copy-redirects plugin not found in vite.config.js');
    } else {
      info.push('✅ copy-redirects plugin found in vite.config.js');
    }
    
    if (!viteConfig.includes("appType: 'spa'")) {
      warnings.push('⚠️ SPA app type not configured in vite.config.js');
    } else {
      info.push('✅ SPA app type configured in vite.config.js');
    }
  } catch (error) {
    warnings.push(`⚠️ Could not read vite.config.js: ${error.message}`);
  }
}

// Display results
console.log('📋 Validation Results:\n');

if (info.length > 0) {
  console.log('ℹ️  Information:');
  info.forEach(item => console.log(`   ${item}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(item => console.log(`   ${item}`));
  console.log('');
}

if (errors.length > 0) {
  console.log('❌ Errors:');
  errors.forEach(item => console.log(`   ${item}`));
  console.log('');
}

// Summary
console.log('📊 Summary:');
console.log(`   ✅ Info: ${info.length}`);
console.log(`   ⚠️  Warnings: ${warnings.length}`);
console.log(`   ❌ Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n🚨 Build validation failed! Please fix the errors above.');
  console.log('\n🔧 Common fixes:');
  console.log('   1. Run: npm run build');
  console.log('   2. Ensure public/_redirects file exists with content: /*    /index.html   200');
  console.log('   3. Check vite.config.js has copy-redirects plugin');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('\n⚠️  Build validation completed with warnings. Review and fix if needed.');
  process.exit(0);
} else {
  console.log('\n🎉 Build validation passed! Your app should deploy correctly.');
  process.exit(0);
} 