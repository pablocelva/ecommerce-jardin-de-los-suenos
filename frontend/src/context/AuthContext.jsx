import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState("user");

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        setUserRole(userData.rol || "user");
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedUserId = localStorage.getItem("userId");
        if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);
                setUserRole(userData.rol || "user");
            } else {
                setIsAuthenticated(false)
                setUser(null)
            }
        }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};
