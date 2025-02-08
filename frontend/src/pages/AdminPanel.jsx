import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import users from "../data/usuarios.json"; // Tu JSON con datos de usuarios

const user = users.find((u) => u.id_usuario === 1); // Tu usuario

const AdminPanel = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Obtener la función logout del contexto


    // Aquí puede haber lógica para verificar si el usuario es administrador
    const isAdmin = true; // Cambiar según la lógica real

    if (!isAdmin) {
        navigate("/profile");
    }

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={user.imagen_perfil} alt="Perfil de usuario" />
            <h2>Panel de Administrador</h2>
            <p>Bienvenido, administrador.</p>
            <h3>Información del usuario:</h3>
            <p>
                <strong>Nombre:</strong> {user.nombre}
            </p>
            <p>
                <strong>Apellido:</strong> {user.apellido}
            </p>
            <p>
                <strong>Email:</strong> {user.email}
            </p>
            <p>
                <strong>Dirección:</strong> {user.direccion}
            </p>
            <p>
                <strong>Teléfono:</strong> {user.telefono}
            </p>
            <p>
                <strong>Rol:</strong> {user.rol}
            </p>
            <p>
                <strong>Fecha de creación:</strong> {user.fecha_creacion}
            </p>
            <button
                onClick={() => {
                logout();
                localStorage.removeItem("userId");
                navigate("/");
                }}
            >
                Cerrar sesión
            </button>
        </div>
    );
};

export default AdminPanel;
