// RegisterHospital.jsx

import React, { useState } from 'react';
import Navbar from '../src/components/NavBarOther';
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const RegisterHospital = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: '',
    hospitalEmail: '',
    hospitalPhone: '',
    hospitalAddress: '',
    adminUsername: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validations = {
    hospitalName: {
      pattern: /^[A-Za-z0-9\s]{3,50}$/,
      message: 'Hospital name must be 3-50 characters long and contain only letters, numbers, and spaces'
    },
    hospitalEmail: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    hospitalPhone: {
      pattern: /^\+?\d{10,14}$/,
      message: 'Phone number must be 10-14 digits long'
    },
    hospitalAddress: {
      pattern: /^.{5,100}$/,
      message: 'Address must be between 5-100 characters long'
    },
    adminUsername: {
      pattern: /^[A-Za-z0-9_]{3,20}$/,
      message: 'Username must be 3-20 characters long and can contain letters, numbers, and underscores'
    },
    password: {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
      message: 'Password must be at least 8 characters long and contain both letters and numbers'
    },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (name, value) => {
    if (validations[name]) {
      if (!validations[name].pattern.test(value)) {
        const errorMessage = validations[name].message;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        return false;
      }
    }
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate all fields except acceptTerms and confirmPassword
    Object.keys(formData).forEach(key => {
      if (key !== 'acceptTerms' && key !== 'confirmPassword') {
        if (!validateField(key, formData[key])) {
          isValid = false;
          newErrors[key] = validations[key].message;
        }
      }
    });

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Validate terms acceptance
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const registerHospitalAndAdmin = async () => {
    try {
      // Add hospital
      const hospitalResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/add-hospital`, {
        name: formData.hospitalName,
        address: formData.hospitalAddress,
        phone: formData.hospitalPhone,
        email: formData.hospitalEmail
      });

      if (!hospitalResponse.data.hospitalId) {
        throw new Error('Hospital ID not received from server');
      }

      const hospitalId = hospitalResponse.data.hospitalId;

      // Add admin user
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/add-user`, {
        email: formData.hospitalEmail,
        password: formData.password,
        first_name: formData.hospitalName,
        last_name: "admin",
        role: "Admin",
        hospital_id: hospitalId,
        username: formData.adminUsername
      });

      // Store hospitalId in localStorage (if needed)
      localStorage.setItem('currentHospitalId', hospitalId);
      
      // Return the hospitalId for navigation
      return hospitalId;

    } catch (error) {
      throw error; // Re-throw to be handled by the calling function
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Validate form
      if (!validateForm()) {
        toast.error('Please fix the errors in the form');
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Registering hospital...');

      // Register hospital and admin
      const hospitalId = await registerHospitalAndAdmin();

      // Success handling
      setTimeout(() => {
        toast.dismiss(loadingToast);
      },1000)
      
      toast.success('Registration successful! Redirecting...');

      // Navigate after a short delay
      setTimeout(() => {
        navigate(`/signin`);
      }, 1000);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ErrorMessage = ({ message }) => (
    message ? <p className="text-red-500 text-sm mt-1">{message}</p> : null
  );

  return (
    <div>
      <Navbar />
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-red-500">
                <path d="M19.5 13.5L12 21l-7.5-7.5c-1.665-1.665-2.5-3.833-2.5-6s.835-4.335 2.5-6c1.665-1.665 3.833-2.5 6-2.5s4.335.835 6 2.5c1.665 1.665 2.5 3.833 2.5 6s-.835 4.335-2.5 6z" />
              </svg>
              <h1 className="text-2xl font-bold text-gray-900">Hospital Registration</h1>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hospital Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-600">Hospital Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Hospital Name</label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.hospitalName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                    required
                  />
                  <ErrorMessage message={errors.hospitalName} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Hospital Email</label>
                  <input
                    type="email"
                    name="hospitalEmail"
                    value={formData.hospitalEmail}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.hospitalEmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                    required
                  />
                  <ErrorMessage message={errors.hospitalEmail} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Hospital Phone</label>
                  <input
                    type="tel"
                    name="hospitalPhone"
                    value={formData.hospitalPhone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.hospitalPhone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                    required
                  />
                  <ErrorMessage message={errors.hospitalPhone} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Hospital Address</label>
                <textarea
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.hospitalAddress ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                  rows="2"
                  required
                />
                <ErrorMessage message={errors.hospitalAddress} />
              </div>
            </div>

            {/* Admin Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-600">Admin Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    name="adminUsername"
                    value={formData.adminUsername}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.adminUsername ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                    required
                  />
                  <ErrorMessage message={errors.adminUsername} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                    required
                  />
                  <ErrorMessage message={errors.password} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-red-500`}
                    required
                  />
                  <ErrorMessage message={errors.confirmPassword} />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500"
          required
        />
        <label className="text-sm font-medium text-gray-700">
          I accept the terms and conditions
        </label>
      </div>
      
      <div className="mt-2 text-xs text-gray-400 pl-6">
        <p>By checking this box, you agree to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-1">
          <li>Provide accurate and current information</li>
          <li>Maintain the security of your account</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Not engage in any unauthorized activities</li>
          <li>Accept our privacy policy and data processing terms</li>
        </ul>
        
        <p className="mt-2 text-gray-400">
          For complete details, please review our full Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
            {errors.acceptTerms && <ErrorMessage message={errors.acceptTerms} />}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Registering...' : 'Register Hospital'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterHospital;