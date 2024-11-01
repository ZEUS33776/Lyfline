import { useState } from 'react';
// src/index.js or src/App.js

import Features from './Features';
 import Banner from './components/Banner';
 import Proceed from './components/Proceed';
import './App.css'
import axios from 'axios'
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

function App() {
 
  
  

  return (
    <Routes>
      <Route path="/" element={<div>
        <Navbar />
      <Banner />
      <Proceed />
      <About />
      
      
      
      </div>} /> 
      <Route path='/signin' element={<div>
        
        <Auth />
      </div>} />
      <Route path="/register" element={<div><RegisterHospital /></div>} />
      <Route path="/admin-dashboard/:id" element={<UserManagementDashboard />} />
      <Route path="/receptionist-dashboard/:id" element={<ReceptionistDashboard />} />
      <Route path="/pathologist-dashboard/:id" element={<PathologistDashboard />} />
        <Route path="/doctor-dashboard/:id" element={<DoctorDashboard />}/>
      
      </Routes>

    // <>
      
      
    //   </>
  )
}

export default App
