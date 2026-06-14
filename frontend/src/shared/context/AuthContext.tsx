import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/shared/schemas";

interface AuthContextValue {
  isAuthenticated: boolean;
  userRole: User["rol"] | null;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<User["rol"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser) as User;
      setUser(userData);
      setIsAuthenticated(true);
      setUserRole(userData.rol);
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
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
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, user, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
