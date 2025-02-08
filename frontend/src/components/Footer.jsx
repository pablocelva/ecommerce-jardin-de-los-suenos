import { Layout } from "antd";
//import "./App.css";

const { Footer } = Layout;

const AppFooter = () => {
return (
    <Footer className="footer">
    <p>&copy; {new Date().getFullYear()} Tu Tienda de Plantas. Todos los derechos reservados.</p>
    </Footer>
);
};

export default AppFooter;