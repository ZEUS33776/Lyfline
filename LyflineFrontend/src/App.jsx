import { useState } from 'react';
import React from 'react';
// src/index.js or src/App.js

import Features from './Features';
import Banner from './components/Banner';
import Proceed from './components/Proceed';
import './App.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './components/About';
import HowItWorks from './components/Howitworks';
import { Route, Routes } from "react-router-dom";
import Auth from './components/Auth';
import HealthForm from './components/Form';
import RegisterHospital from '../pages/Signup';
import UserManagementDashboard from "../pages/AdminDashboard"
import ReceptionistDashboard from "../pages/ReceptionistDashboard"
import PathologistDashboard from '../pages/PathologistDashboard';
import DoctorDashboard from '../pages/DoctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Error Boundary Component for catching React errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log detailed error information
    console.error('🚨 React Error Boundary Caught Error:', {
      error: error,
      errorInfo: errorInfo,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <h1 className="text-3xl font-bold text-red-600 mb-4">🚨 Application Error</h1>
            <p className="text-gray-700 mb-6">
              Something went wrong with the application. Please refresh the page or contact support if the problem persists.
            </p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Error Details:</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Error:</strong> {this.state.error && this.state.error.toString()}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Time:</strong> {new Date().toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>URL:</strong> {window.location.href}
              </p>
            </div>

            <details className="mb-6">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Show Technical Details
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono overflow-auto">
                {this.state.error && this.state.error.stack}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </div>
            </details>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced 404 Component with debugging info
const NotFoundPage = () => {
  const currentPath = window.location.pathname;
  const fullUrl = window.location.href;
  
  console.error('🔍 404 Page Accessed:', {
    path: currentPath,
    fullUrl: fullUrl,
    timestamp: new Date().toISOString(),
    referrer: document.referrer,
    userAgent: navigator.userAgent
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-yellow-800 mb-2">🔍 Debug Information:</h3>
          <p className="text-sm text-yellow-700 mb-1">
            <strong>Requested Path:</strong> {currentPath}
          </p>
          <p className="text-sm text-yellow-700 mb-1">
            <strong>Full URL:</strong> {fullUrl}
          </p>
          <p className="text-sm text-yellow-700 mb-1">
            <strong>Time:</strong> {new Date().toLocaleString()}
          </p>
          <p className="text-sm text-yellow-700">
            <strong>Referrer:</strong> {document.referrer || 'Direct access'}
          </p>
        </div>

        <div className="text-left mb-6">
          <h3 className="font-semibold text-gray-800 mb-2">Available Routes:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <code>/</code> - Home page</li>
            <li>• <code>/signin</code> - Sign in page</li>
            <li>• <code>/register</code> - Register hospital</li>
            <li>• <code>/admin-dashboard/:id</code> - Admin dashboard</li>
            <li>• <code>/doctor-dashboard/:id</code> - Doctor dashboard</li>
            <li>• <code>/receptionist-dashboard/:id</code> - Receptionist dashboard</li>
            <li>• <code>/pathologist-dashboard/:id</code> - Pathologist dashboard</li>
          </ul>
        </div>
        
        <div className="flex space-x-4 justify-center">
          <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Go Home
          </a>
          <button 
            onClick={() => window.history.back()} 
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  // Log app initialization
  console.log('🚀 App Component Initialized:', {
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    buildTime: typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : 'unknown'
  });

  return (
    <ErrorBoundary>
      <Toaster position="top-center" />
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            <div>
              <Navbar />
              <Banner />
              <Proceed />
              <About />
            </div>
          } 
        /> 
        <Route 
          path='/signin' 
          element={<Auth />} 
        />
        <Route 
          path="/register" 
          element={<RegisterHospital />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/admin-dashboard/:id" 
          element={
            <ProtectedRoute requiredRole="Admin">
              <UserManagementDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/receptionist-dashboard/:id" 
          element={
            <ProtectedRoute requiredRole="Receptionist">
              <ReceptionistDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pathologist-dashboard/:id" 
          element={
            <ProtectedRoute requiredRole="Pathologist">
              <PathologistDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard/:id" 
          element={
            <ProtectedRoute requiredRole="Doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Enhanced catch-all route for unmatched paths */}
        <Route 
          path="*" 
          element={<NotFoundPage />} 
        />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
