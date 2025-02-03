import { Layout } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const { Header } = Layout;

const Navbar = () => {

    const { isAuthenticated, userRole, login, logout } = useAuth();
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    

    /*useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);*/
    
    return (
        <Header className="navbar">
            <h2><a href="/">Jardin de los Sueños</a></h2>
            {isAuthenticated ? (
                <div>

                <button onClick={handleLogout}>Cerrar sesión</button>
                <button>
                <NavLink to="/profile" className="nav-link">
                    Mi Perfil
                </NavLink>
                </button>
                <button>
                <NavLink to="/admin" className="nav-link">
                    Admin
                </NavLink>
                </button>
                </div>
            ) : (
                <div>
                <button>
                <NavLink to="/login" className="nav-link">
                    Iniciar Sesión
                </NavLink>
                </button>
    
                <button>
                <NavLink to="/register">
                    Registrarse
                </NavLink>
                </button>
            </div>
            )}
        </Header>
    );
};

export default Navbar;