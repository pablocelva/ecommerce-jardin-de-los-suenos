import { useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate, Link } from "react-router-dom";
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
          name="nombre">
          <Input
            //value={nombre}
            placeholder="Nombre"
            //onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderRadius: "0" }}
          />
        </Form.Item>
        <Form.Item 
          //label="Email" 
          name="apellido">
          <Input
            //value={apellido}
            placeholder="Apellido"
            //onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderRadius: "0" }}
          />
        </Form.Item>
        <Form.Item 
          //label="Email" 
          name="email">
          <Input
            type="email"
            value={email}
            placeholder="Correo electrónico"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderRadius: "0" }}
          />
        </Form.Item>
        <Form.Item 
          //label="Email" 
          name="direccion">
          <Input
            //value={direccion}
            placeholder="Dirección"
            //onChange={(e) => setEmail(e.target.value)}
            required
            style={{ borderRadius: "0" }}
          />
        </Form.Item>
        <Form.Item 
          //label="Contraseña" 
          name="password">
          <Input.Password
            value={password}
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderRadius: "0" }}
          />
        </Form.Item>
        <Form.Item 
          //label="Contraseña" 
          name="passwordconfirm">
          <Input.Password
            //value={passwordconfirm}
            placeholder="Confirmar Contraseña"
            //onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderRadius: "0" }}
          />
        </Form.Item>
        <Form.Item 
          //label="Telefono"
          name="telefono">
          <Input.Password
            //value={passwordconfirm}
            placeholder="Numero de teléfono"
            //onChange={(e) => setPassword(e.target.value)}
            required
            style={{ borderRadius: "0" }}
          />
        </Form.Item>
        <Form.Item 
          style={{ display: "flex", justifyContent: "center" }}
          >
          <button htmltype="submit" style={{ display: "flex", gap: "8px", alignItems: "center", padding: "12px 32px 12px 12px", justifyContent: "center", width: "360px" }}>
            <PersonAddIcon style={{ fontSize: "20px" }} />
            Registrarse
          </button>
          <br />
          <button style={{ display: "flex", alignItems: "center", padding: "12px 12px 12px 12px", justifyContent: "center", backgroundColor: "transparent", color: "#1F7D53", border: "2px solid #1F7D53", width: "360px" }}>
            {/* <PersonAddIcon style={{ fontSize: "20px" }} /> */}
            <Link style={{ color: "#1F7D53", textDecoration: "none" }} to="/login">
            Ya tengo cuenta
            </Link>
          </button>
        </Form.Item>
      </Form>
    </div>
      <AppFooter />
      </>
  );
};

export default RegisterPage;
