import { Button, Form, Input, message, Typography } from "antd";
import { LockOutlined, MailOutlined, LoginOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/context/AuthContext";
import AuthLayout from "@/features/auth/components/AuthLayout";
import AuthPageShell from "@/features/auth/components/AuthPageShell";
import { api, ApiError } from "@/shared/lib/api";
import { loginResponseSchema } from "@/shared/schemas";
import authStyles from "../styles/auth.module.css";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormValues>();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const data = await api.post<unknown>("/auth/login", values);
      const { usuario, token } = loginResponseSchema.parse(data);

      localStorage.setItem("token", token);
      localStorage.setItem("userId", String(usuario.id_usuario));
      localStorage.setItem("user", JSON.stringify(usuario));
      login(usuario);

      if (usuario.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        message.error("Correo electrónico o contraseña incorrectos.");
      } else {
        message.error("Hubo un error al iniciar sesión. Intenta nuevamente.");
      }
    }
  };

  return (
    <AuthPageShell>
      <AuthLayout
        title="Iniciar sesión"
        subtitle="Accede a tu cuenta para gestionar pedidos y tu perfil."
        footer={
          <Typography.Paragraph className={authStyles.cardFooter}>
            ¿No tienes cuenta?{" "}
            <Link to="/register" className={authStyles.link}>
              Regístrate aquí
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
          className={authStyles.form}
        >
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[
              { required: true, message: "Ingresa tu correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: "Ingresa tu contraseña" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Tu contraseña"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className={authStyles.formSubmit}>
            <Button
              type="primary"
              htmlType="submit"
              block
              icon={<LoginOutlined />}
              className={authStyles.submitBtn}
            >
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </AuthLayout>
    </AuthPageShell>
  );
};

export default LoginPage;
