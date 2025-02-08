import { useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (email && password) {
      // Crear un ID ficticio para el nuevo usuario (en un escenario real, se genera en el backend)
      const newUser = {
        id_usuario: Date.now(), // Usamos la fecha actual como un ID único
        email: email,
        password: password, // Asegúrate de encriptar la contraseña en producción
      };

      // Guardamos el usuario en localStorage (en un sistema real, este paso sería en el backend)
      localStorage.setItem("user", JSON.stringify(newUser));
      console.log("Usuario registrado:", newUser);

      // Redirigir al login
      navigate("/login");
    }
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>Registrarse</h2>
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
            Registrarse
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
