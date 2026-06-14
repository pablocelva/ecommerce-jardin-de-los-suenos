import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/context/AuthContext";
import type { User } from "@/shared/schemas";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: User["rol"];
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requiredRole || userRole === requiredRole) {
    return children;
  }

  if (userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (userRole === "cliente") {
    return <Navigate to="/profile" replace />;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
