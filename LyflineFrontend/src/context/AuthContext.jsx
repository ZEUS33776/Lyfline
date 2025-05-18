import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';

// Create the auth context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Validate token expiration
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired, clear auth data
          clearAuthData();
          setUser(null);
        } else {
          // Valid token, set user data
          setUser({
            userId: localStorage.getItem('user_id'),
            hospitalId: localStorage.getItem('hospitalId'),
            role: localStorage.getItem('userRole'),
            token
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('hospitalId');
    localStorage.removeItem('user_id');
    localStorage.removeItem('userRole');
  };
  
  // Login function
  const login = (userData) => {
    try {
      // Store in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('hospitalId', userData.hospitalId);
      localStorage.setItem('user_id', userData.userId);
      localStorage.setItem('userRole', userData.role);
      
      // Update state
      setUser({
        userId: userData.userId,
        hospitalId: userData.hospitalId,
        role: userData.role,
        token: userData.token
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    clearAuthData();
    setUser(null);
    navigate('/signin');
  };
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    if (!user) return false;
    
    try {
      const decoded = jwtDecode(user.token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };
  
  // Check if user has access to a specific hospital
  const hasHospitalAccess = (hospitalId) => {
    if (!user) return false;
    return parseInt(user.hospitalId) === parseInt(hospitalId);
  };
  
  // Auth context value
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasHospitalAccess
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 