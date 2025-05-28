import { useState } from 'react';
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

// Simple test component
const TestPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Routing Works!</h1>
      <p className="text-gray-600 mb-4">This page confirms that client-side routing is working correctly.</p>
      <a href="/signin" className="text-blue-500 hover:underline">Go to Sign In</a>
    </div>
  </div>
);

// 404 Page component
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-blue-500 hover:underline">Go Home</a>
    </div>
  </div>
);

function App() {
  return (
    <>
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
          path="/test" 
          element={<TestPage />} 
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
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
