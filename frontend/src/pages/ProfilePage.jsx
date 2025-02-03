import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
const [user, setUser] = useState(null);
const navigate = useNavigate();

useEffect(() => {
    // Lógica para obtener los datos del usuario (ejemplo, de un API o localStorage)
    const loggedInUser = { name: "Juan Pérez", email: "juan@email.com" };
    setUser(loggedInUser);

    if (!loggedInUser) {
    navigate("/login");
    }
}, [navigate]);

if (!user) return <div>Cargando...</div>;

return (
    <div style={{ padding: "20px" }}>
    <h2>Perfil de Usuario</h2>
    <p><strong>Nombre:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <button onClick={() => navigate("/login")}>Cerrar sesión</button>
    </div>
);
};

export default ProfilePage;
