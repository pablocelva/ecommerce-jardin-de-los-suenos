import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout, Table, Input, message } from "antd";
import AppFooter from "../components/Footer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";
import { api } from "../lib/api";
import { ordersResponseSchema, type Order, type User } from "../schemas";
import { showSuccess } from "../lib/alerts";

const { Sider, Content } = Layout;

const ProfilePage = () => {
  const { logout, userRole } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [showOrders, setShowOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== "cliente") {
      navigate("/");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user") ?? "null") as User | null;
    if (!userInfo) {
      navigate("/login");
      return;
    }

    setUser(userInfo);
    setUserData(userInfo);

    const userId = userInfo.id_usuario;
    const userToken = localStorage.getItem("token");

    if (!userId || !userToken) {
      navigate("/login");
      return;
    }

    api
      .get<unknown>(`/pedidos/usuario/${userId}`, userToken)
      .then((data) => {
        const parsed = ordersResponseSchema.parse(data);
        setUserOrders(parsed.orders);
      })
      .catch((error) => {
        console.error("Error al obtener las órdenes del usuario:", error);
      });
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = async () => {
    if (!userData) return;

    const userId = JSON.parse(localStorage.getItem("user") ?? "null")?.id_usuario;
    const userToken = localStorage.getItem("token");

    try {
      await api.put(`/auth/usuarios/${userId}`, userData, userToken);
      setUser(userData);
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify(userData));
      await showSuccess("Datos actualizados correctamente!");
    } catch (error) {
      console.error("Error al actualizar los datos del usuario:", error);
      message.error("No se pudieron actualizar los datos.");
    }
  };

  const handleMenuClick = (key: string) => {
    setShowOrders(key === "historial");
  };

  if (!user || !userData) {
    return (
      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Cargando...
      </div>
    );
  }

  const columns = [
    {
      title: "Fecha",
      dataIndex: "fecha_compra",
      key: "fecha_compra",
      render: (fecha: string) => {
        const date = new Date(fecha);
        return date.toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      title: "Detalle",
      key: "detalle",
      render: (_: unknown, record: Order) => (
        <span>
          {record.detalle.length > 0 ? (
            record.detalle.map((producto, index) => (
              <span key={producto.id_producto}>
                {producto.nombre_producto}
                {index < record.detalle.length - 1 ? ", " : ""}
              </span>
            ))
          ) : (
            <span>No hay productos</span>
          )}
        </span>
      ),
    },
    { title: "Dirección de envío", dataIndex: "direccion", key: "direccion" },
    { title: "Total", dataIndex: "precio_total", key: "precio_total" },
    { title: "Estado", dataIndex: "estado", key: "estado" },
    { title: "ID Compra", dataIndex: "id_compra", key: "id_compra" },
  ];

  const editableFields = ["email", "password", "nombre", "apellido", "direccion", "telefono"] as const;

  return (
    <Layout style={{ height: "calc(100vh)" }}>
      <Layout style={{ height: "calc(100vh)" }}>
        <Sider className="sider" width={250}>
          <p onClick={() => handleMenuClick("informacion")}>Perfil de Usuario</p>
          <p onClick={() => handleMenuClick("historial")}>Historial de Compras</p>
        </Sider>
        <Layout>
          <Content className="content" style={{ marginLeft: "250px" }}>
            {showOrders ? (
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2>Historial de Compras</h2>
                {userOrders.length > 0 ? (
                  <Table
                    dataSource={userOrders}
                    columns={columns}
                    rowKey="id_compra"
                    scroll={{ x: "max-content" }}
                  />
                ) : (
                  <p>No tienes órdenes.</p>
                )}
              </div>
            ) : (
              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <AccountCircleIcon style={{ fontSize: "60px", color: "lightblue" }} />
                <h2>Perfil de Usuario</h2>
                <div style={{ display: "flex", flexDirection: "column", width: "300px" }}>
                  {editableFields.map((field) => (
                    <div key={field}>
                      <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                      {isEditing ? (
                        <Input
                          name={field}
                          value={String(userData[field] ?? "")}
                          onChange={handleInputChange}
                          style={{ width: "100%", marginBottom: "12px" }}
                        />
                      ) : (
                        <p>{String(userData[field] ?? "")}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={handleSave}
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        padding: "12px 32px 12px 12px",
                      }}
                    >
                      <SaveIcon style={{ fontSize: "20px" }} />
                      Guardar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        padding: "12px 32px 12px 12px",
                      }}
                    >
                      <EditIcon style={{ fontSize: "20px" }} />
                      Editar
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      localStorage.removeItem("userId");
                      navigate("/");
                    }}
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      padding: "12px 32px 12px 12px",
                    }}
                  >
                    <LogoutIcon style={{ fontSize: "20px" }} />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
      <AppFooter />
    </Layout>
  );
};

export default ProfilePage;
