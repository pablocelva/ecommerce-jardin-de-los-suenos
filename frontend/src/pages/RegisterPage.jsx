import { useState } from "react";
import { Input, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

const handleSubmit = () => {
    // Aquí iría la lógica de registro
    if (email && password) {
    // Redirigir al perfil de usuario después de registrarse
    navigate("/profile");
    }
};

return (
    <div style={{ padding: "20px" }}>
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
        <button>
        Registrarse
        </button>
    </Form>
    </div>
);
};

export default RegisterPage;
