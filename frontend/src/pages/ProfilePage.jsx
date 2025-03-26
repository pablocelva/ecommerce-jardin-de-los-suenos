import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout, Table, Typography, Button, Modal, Form, Input, InputNumber } from "antd";
import users from "../data/usuarios.json"; 
import orders from "../data/ordenes.json"; 
import AppFooter from "../components/Footer";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';

const { Sider, Content } = Layout;

const ProfilePage = () => {
  const { logout, userRole } = useAuth();
  const [user, setUser] = useState(null);
  const [selectedKey, setSelectedKey] = useState("informacion");
  const [showOrders, setShowOrders] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== "cliente") {
      navigate("/");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("userId leído en ProfilePage:", userId);

    if (!userId) {
      navigate("/login");
      return;
    }

    // Busca el usuario en el JSON
    const foundUser = users.find(
      (u) => u.id_usuario === userId || u.id_usuario === parseInt(userId)
    );
    
    if (!foundUser) {
      navigate("/login");
      return;
    }
    
    setUser(foundUser);
    setUserData(foundUser);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
};

const handleSave = () => {
    setUser(userData);
    setIsEditing(false);
};

  if (!user) return <div>Cargando...</div>;

  // Función para cambiar la sección seleccionada
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    if (e.key === "historial") {
      setShowOrders(true); // Muestra las órdenes
    } else {
      setShowOrders(false); // Oculta las órdenes
    }
  };

  // Filtra las órdenes del usuario
  const userOrders = orders.filter(
    (order) => order.id_usuario === user.id_usuario
  );

  // Columnas de la tabla para el historial de compras
  const columns = [
    { title: "Fecha", dataIndex: "fecha_orden", key: "fecha_orden" },
    { 
      title: "Detalle", 
      key: "detalle", 
      render: (text, record) => (
        <span>{record.productos.map((producto) => producto.nombre_producto).join(", ")}</span>
      ) 
    },
    { title: "Total", dataIndex: "total", key: "total" },
    { title: "Estado", dataIndex: "estado", key: "estado" },
    { title: "ID Compra", dataIndex: "id_orden", key: "id_orden" }
  ];

  return (
    <Layout style={{ height: "calc(100vh)" }}>
      <Layout style={{ hyphenseight: "calc(100vh)" }}>
        {/* Sidebar con categoria */}
        <Sider className="sider" width={250}>
          <p onClick={() => handleMenuClick({ key: "informacion" })}>Perfil de Usuario</p>
          <p onClick={() => handleMenuClick({ key: "historial" })}>Historial de Compras</p>
        </Sider>
        {/* Contenido principal */}
        <Layout>
          <Content className="content" style={{ marginLeft: "250px" }}>
            {showOrders ? (
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2>Historial de Compras</h2>
                {userOrders.length > 0 ? (
                  <Table 
                    dataSource={userOrders} 
                    columns={columns} 
                    rowKey="id_orden" 
                  />
                ) : (
                  <p>No tienes órdenes.</p>
                )}
              </div>
            ) : (
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* <img src={user.imagen_perfil} alt="Perfil de usuario" /> */}
                <AccountCircleIcon style={{ fontSize: "60px", color: "lightblue" }} />
                <h2>Perfil de Usuario</h2>
                <div style={{ display: "flex", flexDirection: "column", width: "300px" }}>
                                {["nombre", "apellido", "email", "direccion", "telefono"].map((field) => (
                                    <div key={field}>
                                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                                        {isEditing ? (
                                            <Input name={field} value={userData[field]} onChange={handleInputChange} style={{ width: "100%", marginBottom: "12px" }} />
                                        ) : (
                                            <p>{user[field]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: "flex", gap: "16px" }}>
                            {isEditing ? (
                                <button type="primary" onClick={handleSave} style={{ marginTop: "10px", display: "flex", gap: "8px", alignItems: "center", padding: "12px 32px 12px 12px" }}>
                                    <SaveIcon style={{ fontSize: "20px" }} />
                                    Guardar
                                </button>
                            ) : (
                                <button onClick={() => setIsEditing(true)} style={{ marginTop: "10px", display: "flex", gap: "8px", alignItems: "center", padding: "12px 32px 12px 12px" }}>
                                    <EditIcon style={{ fontSize: "20px" }} />
                                    Editar
                                </button>
                            )}

                            <button
                                onClick={() => {
                                    logout();
                                    localStorage.removeItem("userId");
                                    navigate("/");
                                }}
                                style={{ marginTop: "10px", display: "flex", gap: "8px", alignItems: "center", padding: "12px 32px 12px 12px" }}
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
