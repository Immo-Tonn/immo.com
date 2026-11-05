import React from 'react';
import { Navigate } from '@shared/lib/localeRouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Checking token in sessionStorage
  const isAuthenticated = !!sessionStorage.getItem('adminToken');

  // If token is missing, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/add-property" replace />;
  }

  // If token exists, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
