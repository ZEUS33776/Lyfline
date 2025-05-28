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
  
  useEffect(() => {
    const checkAuth = () => {
      // If still loading auth context, don't make any decisions yet
      if (loading) return;

      // Check if user is authenticated
      if (!isAuthenticated()) {
        setIsAuthorized(false);
        return;
      }

      // If a hospital ID is in the URL params, check hospital access
      if (hospitalId && !hasHospitalAccess(hospitalId)) {
        setIsAuthorized(false);
        return;
      }

      // If role requirement is specified, check user role
      if (requiredRole && user?.role !== requiredRole) {
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
    setIsChecking(false);
  }, [loading, isAuthenticated, hasHospitalAccess, hospitalId, requiredRole, user, location.pathname]);
  
  // Show loading state while checking auth
  if (loading || isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  // If not authorized, redirect to signin
  if (!isAuthorized) {
    // Show appropriate error message
    if (!isAuthenticated()) {
      toast.error('Please sign in to continue');
    } else if (hospitalId && !hasHospitalAccess(hospitalId)) {
      toast.error('You do not have access to this hospital');
    } else if (requiredRole && user?.role !== requiredRole) {
      toast.error(`Access denied. ${requiredRole} role required.`);
    }

    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }
  
  // User is authenticated and has proper access
  return children;
};

export default ProtectedRoute; 