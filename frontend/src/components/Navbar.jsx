import { Layout } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header } = Layout;

const Navbar = () => {

    const { isAuthenticated, userRole, login, logout } = useAuth();
    const navigate = useNavigate()
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Header className="navbar">
            <h2><a href="/">Jardin de los Sueños</a></h2>
            {isAuthenticated ? (
                <button onClick={handleLogout}>Cerrar sesión</button>
            ) : (
                <div>
                <button>
                <NavLink to="/login" className="nav-link" activeClassName="active">
                    Iniciar Sesión
                </NavLink>
                </button>
    
                <button>
                <NavLink to="/register" activeClassName="active">
                    Registrarse
                </NavLink>
                </button>
            </div>
            )}
        </Header>
    );
};

export default Navbar;