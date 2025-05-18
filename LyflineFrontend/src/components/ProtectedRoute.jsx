import React, { useEffect, useState } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated, hasHospitalAccess } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const params = useParams();
  const location = useLocation();
  const hospitalId = params.id; // Get hospital ID from URL params
  
  // Force a re-check whenever the path changes
  useEffect(() => {
    setIsChecking(true);
  }, [location.pathname]);
  
  useEffect(() => {
    // Only proceed once the auth context has finished loading
    if (!loading) {
      const checkAuth = () => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          console.log('Authentication check failed');
          toast.error('Authentication required. Please sign in.', {
            id: 'auth-required',
          });
          return false;
        }
        
        // If a hospital ID is in the URL params, check hospital access
        if (hospitalId && !hasHospitalAccess(hospitalId)) {
          console.log('Hospital access check failed');
          toast.error('You do not have access to this hospital.', {
            id: 'hospital-access-denied',
          });
          return false;
        }
        
        // If role requirement is specified, check user role
        if (requiredRole && user && user.role !== requiredRole) {
          console.log('Role check failed');
          toast.error(`Access denied. ${requiredRole} role required.`, {
            id: 'role-required',
          });
          return false;
        }
        
        return true;
      };
      
      // Run the auth check
      const authResult = checkAuth();
      console.log('Auth check result:', authResult);
      setIsAuthorized(authResult);
      setIsChecking(false);
    }
  }, [loading, isAuthenticated, hasHospitalAccess, hospitalId, requiredRole, user, location.pathname]);
  
  // Show loading state while checking auth
  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Verifying your credentials...</p>
        </div>
      </div>
    );
  }
  
  // If not authorized, redirect to signin
  if (!isAuthorized) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }
  
  // User is authenticated and has proper access
  return children;
};

export default ProtectedRoute; 