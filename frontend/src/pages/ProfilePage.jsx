import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout, Table, Input } from "antd";
import axios from "axios";
//import users from "../data/usuarios.json"; 
//import orders from "../data/ordenes.json"; 
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
  const [userOrders, setUserOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== "cliente") {
      navigate("/");
    }
  }, [userRole, navigate]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user")); 
    setUser(userInfo);
    setUserData(userInfo);
    
    const userId = userInfo.id_usuario;
    const userToken = localStorage.getItem("token");
    
    if (!userId || !userToken ) {
      navigate("/login");
      return;
    }

    axios.get(`http://localhost:3000/api/pedidos/usuario/${userId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(response => {
        console.log("Pedidos del usuario:", response.data);
        setUserOrders(response.data.orders);
      })
      .catch(error => {
        console.error("Error al obtener las órdenes del usuario:", error);
      });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
};

const handleSave = () => {
  //const userId = localStorage.getItem("userId");
  const userId = JSON.parse(localStorage.getItem("user"))?.id_usuario;
  const userToken = localStorage.getItem("token");
  axios.put(`http://localhost:3000/api/auth/usuarios/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  })
    .then(response => {
      setUser(userData);
      setIsEditing(false);
      console.log("Respuesta del backend:", response.data);
      message.success("Datos actualizados correctamente!");
      //navigate("/profile");
    })
    .catch(error => {
      console.error("Error al actualizar los datos del usuario:", error);
    });
};

  if (!user) return <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>Cargando...</div>;

  // Función para cambiar la sección seleccionada
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    if (e.key === "historial") {
      setShowOrders(true); // Muestra las órdenes
    } else {
      setShowOrders(false); // Oculta las órdenes
    }
  };

  // Columnas de la tabla para el historial de compras
  /*const columns = [
    { title: "Fecha", dataIndex: "fecha_orden", key: "fecha_orden" },
    { 
      title: "Detalle", 
      key: "detalle", 
      render: (text, record) => (
        <span>
          {record.productos.map((producto, index) => (
            <span key={producto.id_producto}>
              {producto.nombre_producto}
              {index < record.productos.length - 1 ? ", " : ""}
            </span>
          ))}
        </span>
        //<span>{record.productos.map((producto) => producto.nombre_producto).join(", ")}</span>
      ) 
    },
    { title: "Total", dataIndex: "total", key: "total" },
    { title: "Estado", dataIndex: "estado", key: "estado" },
    { title: "ID Compra", dataIndex: "id_orden", key: "id_orden" }
  ];*/
  const columns = [
    { title: "Fecha", dataIndex: "fecha_compra", key: "fecha_compra" },
    { 
      title: "Detalle", 
      key: "detalle", 
      render: (text, record) => (
        <span>
          {console.log("record",record)}
          {console.log("detalle", record.detalle)}
          {record.detalle && record.detalle.length > 0 ? (
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
    { title: "Total", dataIndex: "precio_total", key: "precio_total" },
    { title: "Estado", dataIndex: "estado", key: "estado" },
    { title: "ID Compra", dataIndex: "id_compra", key: "id_compra" }
  ];

  return (
    <Layout style={{ height: "calc(100vh)" }}>
      <Layout style={{ height: "calc(100vh)" }}>
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
                                            <p>{userData[field]}</p>
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
