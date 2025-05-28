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
        
        {/* Catch-all route for unmatched paths */}
        <Route 
          path="*" 
          element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
              <p className="text-lg text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Go Home
              </a>
            </div>
          } 
        />
      </Routes>
    </>
  )
}

export default App
