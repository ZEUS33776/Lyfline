import { useState } from 'react';
// src/index.js or src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
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

function App() {
 
  
  

  return (
    <Routes>
      <Route path="/" element={<div>
        <Navbar />
      <Banner />
      <Proceed />
      <About />
      <Features />
      <HowItWorks />
      
      <Footer />
      </div>} /> 
      <Route path='/signin' element={<div>
        
        <Auth />
      </div>} />
      <Route path="/form" element={<div><HealthForm /></div>} />
      
      </Routes>

    // <>
      
      
    //   </>
  )
}

export default App
