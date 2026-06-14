import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Menu,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  EditOutlined,
  HomeOutlined,
  LogoutOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/shared/context/AuthContext";
import AppFooter from "@/shared/components/Footer";
import { api } from "@/shared/lib/api";
import { ordersResponseSchema, type Order, type User } from "@/shared/schemas";
import { showSuccess } from "@/shared/lib/alerts";

const { Title, Text } = Typography;

type ProfileSection = "profile" | "orders";

const ProfilePage = () => {
  const { logout, userRole } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState<ProfileSection>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== "cliente") {
      navigate("/");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem("user") ?? "null") as User | null;
      const userToken = localStorage.getItem("token");

      if (!userInfo || !userToken) {
        navigate("/login");
        return;
      }

      setUser(userInfo);
      form.setFieldsValue({
        nombre: userInfo.nombre,
        apellido: userInfo.apellido ?? "",
        email: userInfo.email,
        direccion: userInfo.direccion ?? "",
        telefono: userInfo.telefono ?? "",
      });
      setLoading(false);

      try {
        const data = await api.get<unknown>(
          `/pedidos/usuario/${userInfo.id_usuario}`,
          userToken,
        );
        const parsed = ordersResponseSchema.parse(data);
        setUserOrders(parsed.orders);
      } catch (error) {
        console.error("Error al obtener las órdenes del usuario:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    void loadProfile();
  }, [form, navigate]);

  const handleSave = async (values: {
    nombre: string;
    apellido: string;
    email: string;
    direccion: string;
    telefono: string;
    password?: string;
  }) => {
    if (!user) return;

    const userToken = localStorage.getItem("token");
    const payload: User = {
      ...user,
      ...values,
      password: values.password?.trim() ? values.password : user.password,
    };

    try {
      await api.put(`/auth/usuarios/${user.id_usuario}`, payload, userToken);
      setUser(payload);
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify(payload));
      form.setFieldValue("password", "");
      await showSuccess("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
      message.error("No se pudieron actualizar los datos.");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (loading || !user) {
    return (
      <div className="profile-loading">
        <Spin size="large" tip="Cargando perfil…" />
      </div>
    );
  }

  const orderColumns = [
    {
      title: "ID",
      dataIndex: "id_compra",
      key: "id_compra",
      width: 80,
    },
    {
      title: "Fecha",
      dataIndex: "fecha_compra",
      key: "fecha_compra",
      render: (fecha: string) =>
        new Date(fecha).toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      title: "Productos",
      key: "detalle",
      render: (_: unknown, record: Order) =>
        record.detalle.map((p) => p.nombre_producto).join(", ") || "—",
    },
    {
      title: "Total",
      dataIndex: "precio_total",
      key: "precio_total",
      render: (total: number) => `$${Number(total).toFixed(2)}`,
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado: string) => (
        <Tag color={estado === "completado" ? "green" : "blue"}>{estado}</Tag>
      ),
    },
  ];

  return (
    <div className="profile-page">
      <div className="profile-layout">
        <aside className="profile-sider">
          <div className="profile-user-card">
            <Avatar size={64} icon={<UserOutlined />} className="profile-avatar" />
            <Title level={4} className="profile-user-name">
              {user.nombre} {user.apellido}
            </Title>
            <Text type="secondary">{user.email}</Text>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[section]}
            className="profile-menu"
            items={[
              {
                key: "profile",
                icon: <UserOutlined />,
                label: "Mi perfil",
                onClick: () => setSection("profile"),
              },
              {
                key: "orders",
                icon: <ShoppingOutlined />,
                label: "Mis compras",
                onClick: () => setSection("orders"),
              },
            ]}
          />

          <Button
            danger
            block
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="profile-logout-btn"
          >
            Cerrar sesión
          </Button>
        </aside>

        <main className="profile-main">
          <Breadcrumb
            className="profile-breadcrumb"
            items={[
              {
                title: (
                  <Link to="/">
                    <HomeOutlined /> Inicio
                  </Link>
                ),
              },
              { title: "Mi perfil" },
            ]}
          />

          {section === "profile" ? (
            <Card className="profile-card" title="Datos personales">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                disabled={!isEditing}
                className="profile-form"
              >
                <div className="profile-form-row">
                  <Form.Item
                    name="nombre"
                    label="Nombre"
                    rules={[{ required: true, message: "Requerido" }]}
                    className="profile-form-col"
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                  <Form.Item
                    name="apellido"
                    label="Apellido"
                    rules={[{ required: true, message: "Requerido" }]}
                    className="profile-form-col"
                  >
                    <Input prefix={<UserOutlined />} />
                  </Form.Item>
                </div>

                <Form.Item
                  name="email"
                  label="Correo electrónico"
                  rules={[
                    { required: true, message: "Requerido" },
                    { type: "email", message: "Correo inválido" },
                  ]}
                >
                  <Input prefix={<MailOutlined />} />
                </Form.Item>

                <div className="profile-form-row">
                  <Form.Item name="telefono" label="Teléfono" className="profile-form-col">
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                  <Form.Item name="direccion" label="Dirección" className="profile-form-col">
                    <Input />
                  </Form.Item>
                </div>

                {isEditing && (
                  <Form.Item
                    name="password"
                    label="Nueva contraseña (opcional)"
                  >
                    <Input.Password placeholder="Dejar vacío para no cambiar" />
                  </Form.Item>
                )}

                <div className="profile-form-actions">
                  {isEditing ? (
                    <>
                      <Button onClick={() => setIsEditing(false)}>Cancelar</Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                      >
                        Guardar cambios
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing(true)}
                    >
                      Editar perfil
                    </Button>
                  )}
                </div>
              </Form>
            </Card>
          ) : (
            <Card className="profile-card" title="Historial de compras">
              {ordersLoading ? (
                <div className="profile-loading-inline">
                  <Spin />
                </div>
              ) : userOrders.length > 0 ? (
                <Table
                  dataSource={userOrders}
                  columns={orderColumns}
                  rowKey="id_compra"
                  pagination={{ pageSize: 5 }}
                  scroll={{ x: 720 }}
                />
              ) : (
                <Empty description="Aún no tienes compras registradas">
                  <Link to="/catalogo">
                    <Button type="primary">Ir al catálogo</Button>
                  </Link>
                </Empty>
              )}
            </Card>
          )}
        </main>
      </div>
      <AppFooter />
    </div>
  );
};

export default ProfilePage;
