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
      </Routes>
    </>
  )
}

export default App
