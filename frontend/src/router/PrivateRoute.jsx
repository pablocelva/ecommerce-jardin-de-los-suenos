import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Permitir acceso si no se requiere un rol específico o si el rol coincide
  if (!requiredRole || userRole === requiredRole) {
    return children;
  }

  // Si el rol no coincide, redirigir según el rol del usuario
  if (userRole === "admin") {
    return <Navigate to="/admin" replace />;
  } else if (userRole === "cliente") {
    return <Navigate to="/profile" replace />;
  }

  return <Navigate to="/" replace />;
};

export default PrivateRoute;
