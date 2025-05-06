import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirigir al login si no hay usuario
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    // Redirigir al dashboard si el usuario no tiene el rol requerido
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute; 