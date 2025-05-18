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
          
          // Check if token has expiration and if it's expired
          if (decoded.exp && decoded.exp < currentTime) {
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
              // Ensure we preserve the correct type for these values
              setUser({
                userId: userId,
                hospitalId: hospitalId,
                role: userRole,
                token: token
              });
              
              // Validate the token by making a simple API request
              // This can be added if you have an endpoint to validate tokens
              /*
              api.validateToken()
                .catch(error => {
                  console.error('Token validation failed:', error);
                  clearAuthData();
                  setUser(null);
                });
              */
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
    
    // Call initialization immediately
    initAuth();
    
    // Set up storage event listener to sync auth state across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        if (!e.newValue) {
          // Token was removed in another tab
          setUser(null);
        } else {
          // Token was added or changed in another tab
          initAuth();
        }
      } else if (e.key === 'user_id' || e.key === 'hospitalId' || e.key === 'userRole') {
        // Other auth data changed, reinitialize
        initAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);  // Remove navigate dependency to prevent unnecessary re-initialization
  
  // Clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('hospitalId');
    localStorage.removeItem('user_id');
    localStorage.removeItem('userRole');
  };
  
  // Login function
  const login = async (userData) => {
    try {
      if (!userData || !userData.token) {
        console.error('Invalid user data for login', userData);
        return false;
      }
      
      // Clear any existing data first
      clearAuthData();
      
      // Store in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('hospitalId', userData.hospitalId);
      localStorage.setItem('user_id', userData.userId);
      localStorage.setItem('userRole', userData.role);
      
      // Verify data was actually stored
      const tokenStored = localStorage.getItem('token') === userData.token;
      const idStored = localStorage.getItem('user_id') === userData.userId;
      const roleStored = localStorage.getItem('userRole') === userData.role;
      const hospitalStored = localStorage.getItem('hospitalId') === userData.hospitalId;
      
      if (!tokenStored || !idStored || !roleStored || !hospitalStored) {
        console.error('Failed to store auth data in localStorage');
        clearAuthData();
        return false;
      }
      
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
      clearAuthData();
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
    // First check if we have user data in state
    if (!user || !user.token) {
      // If not, check directly in localStorage as fallback
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        // Check if token has expiration and if it's expired
        if (decoded.exp && decoded.exp < currentTime) {
          // Token expired
          clearAuthData();
          return false;
        }
        
        // Token is valid - reconstruct user if needed
        if (!user) {
          const userId = localStorage.getItem('user_id');
          const hospitalId = localStorage.getItem('hospitalId');
          const userRole = localStorage.getItem('userRole');
          
          if (userId && hospitalId && userRole) {
            // Set user in next tick to avoid state update during render
            setTimeout(() => {
              setUser({
                userId,
                hospitalId,
                role: userRole,
                token
              });
            }, 0);
          }
        }
        
        return true;
      } catch (error) {
        console.error('Token validation error from localStorage:', error);
        clearAuthData();
        return false;
      }
    }
    
    // User exists in state, validate the token
    try {
      const decoded = jwtDecode(user.token);
      const currentTime = Date.now() / 1000;
      
      // Some tokens might not have an expiration
      if (decoded.exp && decoded.exp < currentTime) {
        clearAuthData();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Auth validation error:', error);
      clearAuthData();
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