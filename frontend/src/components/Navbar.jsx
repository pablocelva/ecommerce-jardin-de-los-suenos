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
            <button>
                <NavLink to="/" className="nav-link-home">
                    Jardin de los Sueños
                </NavLink>
            </button>
            {isAuthenticated ? (
                <div>
                    <button>
                        <NavLink to="/cart" className="nav-link">
                            Carrito
                        </NavLink>
                    </button>
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
                    <button onClick={handleLogout}>Cerrar sesión</button>
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