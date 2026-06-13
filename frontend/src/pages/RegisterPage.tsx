import { useState } from "react";
import { Input, Button, Form, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import AppFooter from "../components/Footer";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { api, ApiError } from "../lib/api";
import { registerSchema } from "../schemas";
import { showSuccess } from "../lib/alerts";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: Record<string, string>) => {
    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      message.error(parsed.error.errors[0]?.message ?? "Datos inválidos.");
      return;
    }

    const { passwordconfirm: _, ...nuevoRegistroDeUsuario } = parsed.data;

    setIsLoading(true);

    try {
      await api.post("/auth/registro", nuevoRegistroDeUsuario);
      await showSuccess(
        "Usuario registrado",
        "Tu cuenta fue creada correctamente. Inicia sesión para continuar.",
      );
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar el usuario:", error);

      if (
        error instanceof ApiError &&
        (error.data as { id?: string })?.id === "correoDuplicado"
      ) {
        message.error("El correo ya está registrado. Intenta con otro.");
      } else {
        message.error("No se pudo conectar al servidor. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          height: "100vh",
          margin: "auto",
          width: "360px",
        }}
      >
        <h3 style={{ borderBottom: "2px solid #1F7D53" }}>Registrarse</h3>
        <Form onFinish={handleSubmit} style={{ width: "360px" }}>
          <Form.Item
            name="nombre"
            rules={[{ required: true, message: "Por favor ingrese su nombre" }]}
          >
            <Input placeholder="Nombre" style={{ borderRadius: "0" }} />
          </Form.Item>
          <Form.Item
            name="apellido"
            rules={[{ required: true, message: "Por favor ingrese su apellido" }]}
          >
            <Input placeholder="Apellido" style={{ borderRadius: "0" }} />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Por favor ingrese su correo electrónico" },
              { type: "email", message: "El correo electrónico no es válido" },
            ]}
          >
            <Input type="email" placeholder="Correo electrónico" style={{ borderRadius: "0" }} />
          </Form.Item>
          <Form.Item
            name="direccion"
            rules={[{ required: true, message: "Por favor ingrese su dirección" }]}
          >
            <Input placeholder="Dirección" style={{ borderRadius: "0" }} />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Por favor ingrese una contraseña" }]}
          >
            <Input.Password placeholder="Contraseña" style={{ borderRadius: "0" }} />
          </Form.Item>
          <Form.Item
            name="passwordconfirm"
            rules={[{ required: true, message: "Por favor confirme su contraseña" }]}
          >
            <Input.Password placeholder="Confirmar Contraseña" style={{ borderRadius: "0" }} />
          </Form.Item>
          <Form.Item
            name="telefono"
            rules={[{ required: true, message: "Por favor ingrese su número de teléfono" }]}
          >
            <Input placeholder="Número de teléfono" style={{ borderRadius: "0" }} />
          </Form.Item>
          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Button
              className="Button"
              htmlType="submit"
              type="default"
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                padding: "12px 32px 12px 12px",
                justifyContent: "center",
                width: "360px",
                borderRadius: 0,
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spin size="small" />
              ) : (
                <PersonAddIcon style={{ fontSize: "20px" }} />
              )}
              Registrarse
            </Button>
          </Form.Item>

          <Button
            className="Button"
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px",
              justifyContent: "center",
              backgroundColor: "transparent",
              color: "#1F7D53",
              border: "2px solid #1F7D53",
              width: "360px",
              borderRadius: 0,
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
