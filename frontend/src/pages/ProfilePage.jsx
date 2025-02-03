import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import users from "../data/usuarios.json"; // Tu JSON con datos de usuarios

const ProfilePage = () => {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("userId leído en ProfilePage:", userId);

    if (!userId) {
      navigate("/login");
      return;
    }

    // Busca el usuario en el JSON; asegúrate de que el ID en el JSON coincide con lo que guardas.
    const foundUser = users.find((u) => u.id_usuario === userId || u.id_usuario === parseInt(userId));

    if (!foundUser) {
      navigate("/login");
      return;
    }

    setUser(foundUser);
  }, [navigate]);

  if (!user) return <div>Cargando...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <img src={user.imagen_perfil} alt="Perfil de usuario" />
      <h2>Perfil de Usuario</h2>
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

export default ProfilePage;
