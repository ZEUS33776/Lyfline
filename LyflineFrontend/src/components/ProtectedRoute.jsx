import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated, hasHospitalAccess } = useAuth();
  const params = useParams();
  const hospitalId = params.id; // Get hospital ID from URL params
  
  // Show loading state while checking auth
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    toast.error('Authentication required. Please sign in.', {
      id: 'auth-required',
    });
    return <Navigate to="/signin" replace />;
  }
  
  // If a hospital ID is in the URL params, check hospital access
  if (hospitalId && !hasHospitalAccess(hospitalId)) {
    toast.error('You do not have access to this hospital.', {
      id: 'hospital-access-denied',
    });
    return <Navigate to="/signin" replace />;
  }
  
  // If role requirement is specified, check user role
  if (requiredRole && user.role !== requiredRole) {
    toast.error(`Access denied. ${requiredRole} role required.`, {
      id: 'role-required',
    });
    return <Navigate to="/signin" replace />;
  }
  
  // User is authenticated and has proper access
  return children;
};

export default ProtectedRoute; 