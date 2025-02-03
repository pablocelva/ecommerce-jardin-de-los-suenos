// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

// Este componente recibirá un componente como "children" y si el usuario no está autenticado o no tiene el rol adecuado, redirigirá al login.
const PrivateRoute = ({ children, isAuthenticated, requiredRole }) => {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Si el usuario no tiene el rol requerido, redirigir a la página de perfil o a cualquier otra
    if (requiredRole && !requiredRole.includes("admin")) {
        return <Navigate to="/profile" />;
    }

    return children;
};

export default PrivateRoute;
