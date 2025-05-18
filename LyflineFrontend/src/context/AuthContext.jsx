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
  
  // Clear all auth data
  const clearAuthData = useCallback(() => {
    safeStorage.remove('token');
    safeStorage.remove('hospitalId');
    safeStorage.remove('user_id');
    safeStorage.remove('userRole');
    setUser(null);
  }, []);
  
  // Check if token is valid
  const isTokenValid = useCallback((token) => {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Some JWTs might not have an expiration claim
      if (decoded.exp && decoded.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }, []);
  
  // Load user from localStorage
  const loadUserFromStorage = useCallback(() => {
    try {
      const token = safeStorage.get('token');
      if (!token || !isTokenValid(token)) {
        clearAuthData();
        return null;
      }
      
      const userId = safeStorage.get('user_id');
      const hospitalId = safeStorage.get('hospitalId');
      const userRole = safeStorage.get('userRole');
      
      if (!userId || !hospitalId || !userRole) {
        clearAuthData();
        return null;
      }
      
      return {
        userId,
        hospitalId,
        role: userRole,
        token
      };
    } catch (error) {
      console.error('Error loading user from storage:', error);
      clearAuthData();
      return null;
    }
  }, [clearAuthData, isTokenValid]);
  
  // Initialize auth state
  useEffect(() => {
    try {
      const userData = loadUserFromStorage();
      setUser(userData);
    } catch (error) {
      console.error('Auth initialization error:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
    
    // Listen for storage events (for multi-tab support)
    const handleStorageChange = (e) => {
      if (['token', 'user_id', 'hospitalId', 'userRole'].includes(e.key)) {
        const userData = loadUserFromStorage();
        setUser(userData);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [clearAuthData, loadUserFromStorage]);
  
  // Login function
  const login = useCallback(async (userData) => {
    if (!userData || !userData.token) {
      console.error('Invalid user data for login', userData);
      return false;
    }
    
    try {
      // Clear existing data first
      clearAuthData();
      
      // Store in localStorage
      const tokenSet = safeStorage.set('token', userData.token);
      const hospitalSet = safeStorage.set('hospitalId', userData.hospitalId);
      const userIdSet = safeStorage.set('user_id', userData.userId);
      const roleSet = safeStorage.set('userRole', userData.role);
      
      if (!tokenSet || !hospitalSet || !userIdSet || !roleSet) {
        console.error('Failed to store auth data');
        clearAuthData();
        return false;
      }
      
      // Verify the token is valid
      if (!isTokenValid(userData.token)) {
        console.error('Invalid token provided');
        clearAuthData();
        return false;
      }
      
      // Set user in state
      const newUser = {
        userId: userData.userId,
        hospitalId: userData.hospitalId,
        role: userData.role,
        token: userData.token
      };
      
      setUser(newUser);
      
      // Double verify the data was set correctly
      const storedToken = safeStorage.get('token');
      if (storedToken !== userData.token) {
        console.error('Token verification failed after setting');
        clearAuthData();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      clearAuthData();
      return false;
    }
  }, [clearAuthData, isTokenValid]);
  
  // Logout function
  const logout = useCallback(() => {
    clearAuthData();
    navigate('/signin');
  }, [clearAuthData, navigate]);
  
  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    // First check if we have user data in state
    if (user && user.token && isTokenValid(user.token)) {
      return true;
    }
    
    // If not, try to load from storage
    const freshUser = loadUserFromStorage();
    if (freshUser) {
      // Update user state if found in storage
      setUser(freshUser);
      return true;
    }
    
    return false;
  }, [user, isTokenValid, loadUserFromStorage]);
  
  // Check if user has access to a specific hospital
  const hasHospitalAccess = useCallback((hospitalId) => {
    if (!isAuthenticated()) return false;
    
    const currentUser = user || loadUserFromStorage();
    if (!currentUser || !currentUser.hospitalId) return false;
    
    return parseInt(currentUser.hospitalId) === parseInt(hospitalId);
  }, [isAuthenticated, user, loadUserFromStorage]);
  
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