import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import ProductPage from "../pages/ProductPage";
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import AdminPanel from '../pages/AdminPanel';
import PrivateRoute from "../router/PrivateRoute";
import { AuthProvider } from '../context/AuthContext';  

const AppRouter = () => {
    
    // Simulación de estado de autenticación y rol (esto lo puedes sacar de tu contexto o Redux, por ejemplo)
    const isAuthenticated = true; // Cambia esto según tu lógica de autenticación
    const userRole = "admin"; // Cambia esto según el rol del usuario (ej. admin, user)

return (
    
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductPage />} />
                {/* <Route path="/about" element={<About />} /> */}
                <Route path="*" element={<NotFound />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protegiendo la ruta de Perfil */}
                <Route
                path="/profile"
                element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                    <ProfilePage />
                    </PrivateRoute>
                }
                />

                {/* Protegiendo la ruta de Admin */}
                <Route
                path="/admin"
                element={
                    <PrivateRoute isAuthenticated={isAuthenticated} requiredRole={userRole}>
                    <AdminPanel />
                    </PrivateRoute>
                }
                />
            </Routes>
      
    );
};

export default AppRouter;
