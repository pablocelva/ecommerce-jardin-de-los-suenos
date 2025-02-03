import { useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import users from "../data/usuarios.json"; // Importamos la data de usuarios

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

      // 2. Guardar su ID en localStorage
      login(usuarioEncontrado);
      localStorage.setItem("userId", usuarioEncontrado.id_usuario);
      console.log("userId guardado:", usuarioEncontrado.id_usuario);

      // 3. Redirigir a /profile
      navigate("/profile");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Iniciar Sesión</h2>
      <Form onFinish={handleSubmit}>
        <Form.Item label="Email" name="email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item label="Contraseña" name="password">
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Item>
        <Form.Item>
          <button htmlType="submit">
            Iniciar Sesión
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
