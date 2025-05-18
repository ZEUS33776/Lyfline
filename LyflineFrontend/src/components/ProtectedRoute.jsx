import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated, hasHospitalAccess } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const params = useParams();
  const hospitalId = params.id; // Get hospital ID from URL params
  
  useEffect(() => {
    // Only proceed once the auth context has finished loading
    if (!loading) {
      const checkAuth = () => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          toast.error('Authentication required. Please sign in.', {
            id: 'auth-required',
          });
          return false;
        }
        
        // If a hospital ID is in the URL params, check hospital access
        if (hospitalId && !hasHospitalAccess(hospitalId)) {
          toast.error('You do not have access to this hospital.', {
            id: 'hospital-access-denied',
          });
          return false;
        }
        
        // If role requirement is specified, check user role
        if (requiredRole && user && user.role !== requiredRole) {
          toast.error(`Access denied. ${requiredRole} role required.`, {
            id: 'role-required',
          });
          return false;
        }
        
        return true;
      };
      
      setIsAuthorized(checkAuth());
      setIsChecking(false);
    }
  }, [loading, isAuthenticated, hasHospitalAccess, hospitalId, requiredRole, user]);
  
  // Show loading state while checking auth
  if (loading || isChecking) {
    return <div className="flex justify-center items-center h-screen">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  // If not authorized, redirect to signin
  if (!isAuthorized) {
    return <Navigate to="/signin" replace />;
  }
  
  // User is authenticated and has proper access
  return children;
};

export default ProtectedRoute; 