import { Layout, Badge, Image, Space, Typography } from "antd";
import { BellFilled, MailOutlined, UserOutlined, ShoppingCartOutlined, PoweroffOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import GrassIcon from "@mui/icons-material/Grass"

const { Header } = Layout;

const Navbar = () => {

    const { isAuthenticated, userRole, logout } = useAuth();
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
        <Header className="AppHeader">
            <Typography.Title color="white" style={{ fontSize: "28px", display: "flex", gap: "8px", alignItems: "center" }}>
                <GrassIcon color="white" style={{ fontSize: "40px", color: "white" }} />
                <NavLink to="/" style={{ color: "#f3f3f3" }}>
                    Jardin de los Sueños
                </NavLink>
            </Typography.Title>
            <Space>
                {isAuthenticated ? (
                    <div style={{ display: "flex", gap: "20px" }}>
                        {userRole === "cliente" && (
                            <>
                                <NavLink 
                                    to="/"     
                                    className="nav-link" 
                                    style={{ color: "white" }}
                                >
                                    Tienda
                                </NavLink>
                                <NavLink 
                                    to="/cart"     
                                    className="nav-link" 
                                    style={{ color: "white" }}
                                >
                                    Carrito
                                </NavLink>
                                <NavLink
                                    to="/profile" 
                                    className="nav-link" 
                                    style={{ color: "white" }}
                                >
                                    Mi Perfil
                                </NavLink>
                            </>
                        )}
                        {userRole === "admin" && (
                            <>
                            <NavLink 
                                to="/" 
                                className="nav-link" 
                                style={{ color: "white" }}
                            >
                                Tienda
                            </NavLink>
                            <NavLink 
                                to="/admin" 
                                className="nav-link" 
                                style={{ color: "white" }}
                            >
                                Admin
                            </NavLink>
                            </>
                        )}
                        <NavLink 
                            onClick={handleLogout}
                            className="nav-link" 
                            style={{ color: "white" }}
                            to="/"
                        >
                            Cerrar sesión
                        </NavLink>
                    </div>
                ) : (
                    <div style={{ display: "flex", gap: "20px" }}>
                        <NavLink 
                            to="/" 
                            className="nav-link" 
                            style={{ color: "white" }}
                        >
                            Tienda
                        </NavLink>
                        <NavLink 
                            to="/login" 
                            className="nav-link" 
                            style={{ color: "white" }}
                        >
                            Iniciar Sesión
                        </NavLink>
                        <NavLink 
                            to="/register" 
                            className="nav-link" 
                            style={{ color: "white" }}
                        >
                            Registrarse
                        </NavLink>
                    </div>
                )}
                {/* <Badge count={5}>
                    <MailOutlined style={{ fontSize: 24 }} />
                </Badge>
                <Badge count={2}>
                    <BellFilled  style={{ fontSize: 24 }} />
                </Badge> */}
                
            </Space>
        </Header>
    );
};

export default Navbar;