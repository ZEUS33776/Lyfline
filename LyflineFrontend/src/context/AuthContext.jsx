import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
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

// Helper to safely access localStorage
const safeStorage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check if token is valid
  const isTokenValid = useCallback((token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }, []);
  
  // Clear all auth data
  const clearAuthData = useCallback(() => {
    setUser(null);
    safeStorage.remove('token');
    safeStorage.remove('hospitalId');
    safeStorage.remove('user_id');
    safeStorage.remove('userRole');
  }, []);
  
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = safeStorage.get('token');
        if (!token || !isTokenValid(token)) {
          clearAuthData();
          return;
        }
        
        const hospitalId = safeStorage.get('hospitalId');
        const userId = safeStorage.get('user_id');
        const role = safeStorage.get('userRole');
        
        if (!hospitalId || !userId || !role) {
          clearAuthData();
          return;
        }
        
        setUser({
          userId,
          hospitalId,
          role,
          token
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, [clearAuthData, isTokenValid]);
  
  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    const token = safeStorage.get('token');
    return isTokenValid(token);
  }, [isTokenValid]);
  
  // Check if user has access to a hospital
  const hasHospitalAccess = useCallback((hospitalId) => {
    if (!user) return false;
    return user.hospitalId === hospitalId;
  }, [user]);
  
  // Login function
  const login = useCallback(async (userData) => {
    try {
      setLoading(true);
      
      // Clear existing data first
      clearAuthData();
      
      // Store in localStorage
      const tokenSet = safeStorage.set('token', userData.token);
      const hospitalSet = safeStorage.set('hospitalId', userData.hospitalId);
      const userIdSet = safeStorage.set('user_id', userData.userId);
      const roleSet = safeStorage.set('userRole', userData.role);
      
      if (!tokenSet || !hospitalSet || !userIdSet || !roleSet) {
        throw new Error('Failed to store auth data');
      }
      
      // Verify the token is valid
      if (!isTokenValid(userData.token)) {
        throw new Error('Invalid token provided');
      }
      
      // Set user in state
      const newUser = {
        userId: userData.userId,
        hospitalId: userData.hospitalId,
        role: userData.role,
        token: userData.token
      };
      
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      return false;
    } finally {
      setLoading(false);
    }
  }, [clearAuthData, isTokenValid]);
  
  // Logout function
  const logout = useCallback(() => {
    clearAuthData();
    navigate('/signin');
  }, [clearAuthData, navigate]);
  
  // Auth context value
  const contextValue = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasHospitalAccess
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 