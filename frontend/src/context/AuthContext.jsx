// src/context/AuthContext.jsx
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userRole, setUserRole] = useState("user"); // O "admin"

const login = () => {
    setIsAuthenticated(true);
    setUserRole("user"); // Cambia según el rol del usuario
};

const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
};

return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
    {children}
    </AuthContext.Provider>
);
};
