import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

// Helper to check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Helper to validate hospital access
export const hasHospitalAccess = (routeHospitalId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    const decoded = jwtDecode(token);
    return decoded.hospitalId === parseInt(routeHospitalId);
  } catch (error) {
    return false;
  }
};

// Get current user's role
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Get user ID
export const getUserId = () => {
  return localStorage.getItem('user_id');
};

// Handle authentication check and redirect if needed
export const checkAuthAndRedirect = (navigate) => {
  if (!isAuthenticated()) {
    toast.error('Authentication required');
    navigate('/signin');
    return false;
  }
  return true;
};

// Clear auth data (for logout)
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('hospitalId');
  localStorage.removeItem('user_id');
  localStorage.removeItem('userRole');
};

// Get hospital ID from token
export const getHospitalId = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    return decoded.hospitalId;
  } catch (error) {
    return null;
  }
};

export default {
  isAuthenticated,
  hasHospitalAccess,
  getUserRole,
  getUserId,
  checkAuthAndRedirect,
  clearAuth,
  getHospitalId
}; 