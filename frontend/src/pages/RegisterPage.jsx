import { useState } from "react";
import { Input, Button, Form, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppFooter from "../components/Footer";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
const apiURL = import.meta.env.VITE_API_URL;

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Maneja el envío del formulario
  const handleSubmit = async (values) => {
    const { nombre, apellido, email, direccion, password, passwordconfirm, telefono } = values;

    if (!nombre || !apellido || !email || !direccion || !password || !passwordconfirm || !telefono) {
      message.error("Por favor, complete todos los campos.");
      return;
    }

    if (password !== passwordconfirm) {
      message.error("Las contraseñas no coinciden.");
      return;
    }

    // Crear un objeto con los datos del usuario
    const nuevoRegistroDeUsuario = {
      nombre,
      apellido,
      email,
      direccion,
      password, 
      telefono,
    };

    setIsLoading(true);

    try {
      //const response = await axios.post("http://localhost:3000/api/auth/registro", nuevoRegistroDeUsuario);
      const response = await axios.post(`${apiURL}/auth/registro`, nuevoRegistroDeUsuario);
      console.log("Respuesta del backend:", response.data);
      message.success("Usuario registrado correctamente!");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      
      // Verifica si el error tiene una respuesta (es decir, que el backend respondió con un error)
      if (error.response && error.response.data.id === 'correoDuplicado') {
        message.error("El correo ya está registrado. Intenta con otro.");
      } else {
        // Si no hubo una respuesta del backend (por ejemplo, problemas de red)
        message.error("No se pudo conectar al servidor. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "flex-start", height: "100vh", margin: "auto", width: "360px" }}>
        <h3 style={{ borderBottom: "2px solid #1F7D53" }}>Registrarse</h3>
        <Form onFinish={handleSubmit} style={{ width: "360px" }}>
          <Form.Item
            name="nombre"
            rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
          >
            <Input placeholder="Nombre" style={{ borderRadius: "0" }} />
          </Form.Item>
          <Form.Item
            name="apellido"
            rules={[{ required: true, message: 'Por favor ingrese su apellido' }]}
          >
            <Input placeholder="Apellido" style={{ borderRadius: "0" }} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Por favor ingrese su correo electrónico' },
              { type: 'email', message: 'El correo electrónico no es válido' }
            ]}
          >
            <Input
              type="email"
              //value={email}
              placeholder="Correo electrónico"
              //onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: "0" }}
            />
          </Form.Item>
          <Form.Item
            name="direccion"
            rules={[{ required: true, message: 'Por favor ingrese su dirección' }]}
          >
            <Input placeholder="Dirección" style={{ borderRadius: "0" }} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor ingrese una contraseña' }]}
          >
            <Input.Password
              //value={password}
              placeholder="Contraseña"
              //onChange={(e) => setPassword(e.target.value)}
              style={{ borderRadius: "0" }}
            />
          </Form.Item>
          <Form.Item
            name="passwordconfirm"
            rules={[{ required: true, message: 'Por favor confirme su contraseña' }]}
          >
            <Input.Password
              placeholder="Confirmar Contraseña"
              style={{ borderRadius: "0" }}
            />
          </Form.Item>
          <Form.Item
            name="telefono"
            rules={[{ required: true, message: 'Por favor ingrese su número de teléfono' }]}
          >
            <Input placeholder="Número de teléfono" style={{ borderRadius: "0" }} />
          </Form.Item>
          {/* Loading spinner */}
          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Button
              className="Button"
              htmlType="submit"
              type="secondary"
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                padding: "12px 32px 12px 12px",
                justifyContent: "center",
                width: "360px",
                borderRadius: 0
              }}
              disabled={isLoading}
            >
              {isLoading ? <Spin size="small" /> : <PersonAddIcon style={{ fontSize: "20px" }} />}
              Registrarse
            </Button>
          </Form.Item>

          <Button
            className="Button"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 12px 12px 12px",
              justifyContent: "center",
              backgroundColor: "transparent",
              color: "#1F7D53",
              border: "2px solid #1F7D53",
              width: "360px",
              borderRadius: 0
            }}
            onClick={() => navigate("/login")}
          >
            Ya tengo cuenta
          </Button>
        </Form>
      </div>
      <AppFooter />
    </>
  );
};

export default RegisterPage;
