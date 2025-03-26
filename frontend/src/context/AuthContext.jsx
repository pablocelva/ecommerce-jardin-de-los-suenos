import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            setUserRole(userData.rol);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        setUserRole(userData.rol);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        localStorage.removeItem("user");
        //localStorage.removeItem("userId");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, user, login, logout, loading }}>
        {!loading && children}
        </AuthContext.Provider>
    );
}
