import { Navigate } from 'react-router-dom';

export const ProtectedRoute2 = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has correct role
  if (userRole !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
    }
    if (userRole === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    // If no valid role, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};