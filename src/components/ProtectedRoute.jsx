import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const ProtectedRoute = ({ element: Element, requiresFullAccess }) => {
  const { isAuthenticated, hasFullAccess } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (requiresFullAccess && !hasFullAccess) {
    return <Navigate to="/reports/general" />;
  }

  return Element;
};

export default ProtectedRoute;
