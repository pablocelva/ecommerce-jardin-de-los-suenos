import { useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/Footer";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

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
    <>
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "flex-start", height : "100vh", margin: "auto", width: "360px" }}>
      <h3 style={{ borderBottom: "2px solid #1F7D53" }}>Registrarse</h3>
      <Form onFinish={handleSubmit} style={{ width: "360px" }}>
        <Form.Item 
          //label="Email" 
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
            <PersonAddIcon style={{ fontSize: "20px" }} />
            Registrarse
          </button>
        </Form.Item>
      </Form>
    </div>
      <AppFooter />
      </>
  );
};

export default RegisterPage;
