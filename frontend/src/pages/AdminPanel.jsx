import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
const navigate = useNavigate();

// Aquí puede haber lógica para verificar si el usuario es administrador
const isAdmin = true; // Cambiar según la lógica real

if (!isAdmin) {
    navigate("/profile");
}

return (
    <div style={{ padding: "20px" }}>
    <h2>Panel de Administrador</h2>
    <p>Bienvenido, administrador.</p>
    {/* Aquí agregarías el contenido específico para los administradores */}
    </div>
);
};

export default AdminPanel;
