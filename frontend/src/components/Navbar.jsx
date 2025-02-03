import { Layout } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const Navbar = () => {
    return (
        <Header className="navbar">
            <h2><a href="/">Jardin de los Sueños</a></h2>
            <ul>
                
                <li><a href="/login">Iniciar Sesión</a></li>
                <li><a href="/register">Registrarse</a></li>
                
                {/* <li>Contacto</li> */}
            </ul>
        </Header>
    );
};

export default Navbar;
