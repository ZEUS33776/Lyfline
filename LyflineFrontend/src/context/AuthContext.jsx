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
        
        try {
          // Validate token expiration
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp && decoded.exp < currentTime) {
            // Token expired, clear auth data
            console.log('Token expired');
            clearAuthData();
            setUser(null);
          } else {
            // Valid token, set user data
            const userId = localStorage.getItem('user_id');
            const hospitalId = localStorage.getItem('hospitalId');
            const userRole = localStorage.getItem('userRole');
            
            if (!userId || !hospitalId || !userRole) {
              console.log('Missing user data');
              clearAuthData();
              setUser(null);
            } else {
              setUser({
                userId,
                hospitalId,
                role: userRole,
                token
              });
            }
          }
        } catch (decodeError) {
          console.error('Token decode error:', decodeError);
          clearAuthData();
          setUser(null);
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
    
    // Set up storage event listener to sync auth state across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token was removed in another tab
        setUser(null);
      } else if (e.key === 'token' && e.newValue) {
        // Token was added in another tab
        initAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);
  
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
      if (!userData || !userData.token) {
        console.error('Invalid user data for login', userData);
        return false;
      }
      
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
    if (!user || !user.token) return false;
    
    try {
      const decoded = jwtDecode(user.token);
      const currentTime = Date.now() / 1000;
      
      // Some tokens might not have an expiration
      if (decoded.exp && decoded.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Auth validation error:', error);
      return false;
    }
  };
  
  // Check if user has access to a specific hospital
  const hasHospitalAccess = (hospitalId) => {
    if (!user) return false;
    return user.hospitalId && parseInt(user.hospitalId) === parseInt(hospitalId);
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