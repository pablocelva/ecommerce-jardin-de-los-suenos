import { useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

const handleSubmit = () => {
    // Aquí iría la lógica de autenticación
    if (email && password) {
    // Redirigir al perfil de usuario si el login es exitoso
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
        <button>
        Iniciar Sesión
        </button>
    </Form>
    </div>
);
};

export default LoginPage;
