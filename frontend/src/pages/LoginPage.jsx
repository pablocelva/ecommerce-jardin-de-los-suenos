import { useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import users from "../data/usuarios.json"; // Importamos la data de usuarios
import AppFooter from "../components/Footer";
import LoginIcon from '@mui/icons-material/Login';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (email && password) {
      // 1. Buscar el usuario en la base de datos
      const usuarioEncontrado = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!usuarioEncontrado) {
        alert("Email o contraseña incorrectos");
        return;
      }

      // 2. Guardar usuario y token en localStorage
      login(usuarioEncontrado);
      localStorage.setItem("userId", usuarioEncontrado.id_usuario);
      localStorage.setItem("user", JSON.stringify(usuarioEncontrado));
      localStorage.setItem("token", "tu_token_jwt"); // Aquí necesitamos el token real del backend

      // 3. Redirigir según el rol
      if (usuarioEncontrado.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  };

  return (
    <>
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "flex-start", height : "100vh", margin: "auto", width: "360px" }}>
      <h3 style={{ borderBottom: "2px solid #1F7D53" }}>Iniciar Sesión</h3>
      <Form onFinish={handleSubmit} style={{ width: "360px" }}>
        <Form.Item 
          //</Form>label="Email" 
            name="email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderRadius: "0" }}
            />
        </Form.Item>
        <Form.Item 
          //label="Contraseña" 
          name="password">
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderRadius: "0" }}
            />
        </Form.Item>
        <Form.Item
          style={{ display: "flex", justifyContent: "flex-end" }}
        
        >
          <button htmlType="submit" style={{ display: "flex", gap: "8px", alignItems: "center", padding: "12px 32px 12px 12px", width: "360px", justifyContent: "center" }}>
            <LoginIcon style={{ fontSize: "20px" }} />
            Iniciar Sesión
          </button>
        </Form.Item>
      </Form>
    </div>
    <AppFooter></AppFooter>
    </>
  );
};

export default LoginPage;
