import { Button, Form, Input, message, Typography } from "antd";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/features/auth/components/AuthLayout";
import AuthPageShell from "@/features/auth/components/AuthPageShell";
import { api, ApiError } from "@/shared/lib/api";
import { registerSchema } from "@/shared/schemas";
import { showSuccess } from "@/shared/lib/alerts";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values: Record<string, string>) => {
    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      message.error(parsed.error.errors[0]?.message ?? "Datos inválidos.");
      return;
    }

    const { passwordconfirm: _, ...nuevoRegistroDeUsuario } = parsed.data;

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
    }
  };

  return (
    <AuthPageShell>
      <AuthLayout
        title="Crear cuenta"
        subtitle="Completa tus datos para empezar."
        wide
        footer={
          <Typography.Paragraph className="auth-card-footer">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="auth-link">
              Inicia sesión
            </Link>
          </Typography.Paragraph>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          size="middle"
          className="auth-form auth-form-register"
        >
        <div className="auth-form-row">
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: "Ingresa tu nombre" }]}
            className="auth-form-col"
          >
            <Input prefix={<UserOutlined />} placeholder="Nombre" />
          </Form.Item>
          <Form.Item
            name="apellido"
            label="Apellido"
            rules={[{ required: true, message: "Ingresa tu apellido" }]}
            className="auth-form-col"
          >
            <Input prefix={<UserOutlined />} placeholder="Apellido" />
          </Form.Item>
        </div>

        <div className="auth-form-row">
          <Form.Item
            name="email"
            label="Correo"
            rules={[
              { required: true, message: "Ingresa tu correo" },
              { type: "email", message: "Correo inválido" },
            ]}
            className="auth-form-col"
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </Form.Item>
          <Form.Item
            name="telefono"
            label="Teléfono"
            rules={[{ required: true, message: "Ingresa tu teléfono" }]}
            className="auth-form-col"
          >
            <Input prefix={<PhoneOutlined />} placeholder="+56 9 1234 5678" />
          </Form.Item>
        </div>

        <Form.Item
          name="direccion"
          label="Dirección"
          rules={[{ required: true, message: "Ingresa tu dirección" }]}
        >
          <Input prefix={<HomeOutlined />} placeholder="Calle, número, comuna" />
        </Form.Item>

        <div className="auth-form-row">
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: "Ingresa una contraseña" }]}
            className="auth-form-col"
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>
          <Form.Item
            name="passwordconfirm"
            label="Confirmar"
            rules={[{ required: true, message: "Confirma tu contraseña" }]}
            className="auth-form-col"
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Repetir" />
          </Form.Item>
        </div>

        <Form.Item className="auth-form-submit">
          <Button
            type="primary"
            htmlType="submit"
            block
            className="auth-submit-btn"
          >
            Registrarse
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
    </AuthPageShell>
  );
};

export default RegisterPage;
