import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Layout, Table, Typography, Button, Modal, Form, Input, InputNumber } from "antd";
//import users from "../data/usuarios.json";
//import productos from "../data/productos.json";
//import orders from "../data/ordenes.json";
import AppFooter from "../components/Footer";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";

const { Sider, Content } = Layout;
const { Title } = Typography;

const AdminPanel = () => {
    const { userRole, logout } = useAuth();
    const navigate = useNavigate();

    const [selectedKey, setSelectedKey] = useState("informacion");
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    
    const [users, setUsers] = useState([]);
    const [productosData, setProductosData] = useState([]);	
    const [orders, setOrders] = useState([]);

    const [showUsers, setShowUsers] = useState(false);
    const [showCatalogo, setShowCatalogo] = useState(false);
    const [showVentas, setShowVentas] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const [form] = Form.useForm(); 

    useEffect(() => {
        if (userRole !== "admin") {
            navigate("/");
        }

        const fetchData = async () => {

            try{
                const token = localStorage.getItem("token")
                const [usersRes, productosRes, ordersRes] = await Promise.all([
                    axios.get("http://localhost:3000/api/auth/usuarios/", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    axios.get("http://localhost:3000/api/productos/", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    axios.get("http://localhost:3000/api/pedidos/", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);
                //console.log("Usuarios:", usersRes.data);
                //console.log("Productos:", productosRes.data);
                //console.log(ordersRes.data);
                //console.log("Pedidos:", ordersRes.data.orders);

                setUsers(usersRes.data);
                setProductosData(productosRes.data);
                setOrders(ordersRes.data.orders);

                const adminUser = usersRes.data.find((u) => u.id_usuario === 1 || u.rol === "admin");
                setUser(adminUser);
                setUserData(adminUser);
            } catch (error) {
                console.log("Error al cargar datos desde la API: ", error);
            }
        };
        fetchData();
    }, [userRole, navigate]);

    const handleMenuClick = (e) => {
        setSelectedKey(e.key);
        setShowUsers(e.key === "usuarios");
        setShowCatalogo(e.key === "catalogo");
        setShowVentas(e.key === "ventas");
    };

    const handleAddProduct = async (values) => {
        try {
            const res = await axios.post("http://localhost:3000/api/productos/", values);
            setProductosData([...productosData, res.data]);
            setIsModalOpen(false);
        } catch (error) {
            console.log("Error al agregar producto: ", error);
        }
    }

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        form.setFieldsValue(product);
        setIsEditModalOpen(true);
    };
    
    const handleUpdateProduct = async (values) => {
        try {
            const updated = { ...editingProduct, ...values };
            await axios.put(`http://localhost:3000/api/productos/${editingProduct.id_producto}`, updated);

            setProductosData((prev) =>
                prev.map((p) =>(p.id_producto === editingProduct.id_producto ? updated : p))
            )
            setIsEditModalOpen(false);
            setEditingProduct(null);
        } catch (error) {
            console.log("Error al actualizar producto: ", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setUser(userData);
        //setIsEditing(false);
    };

    //console.log(orders);
    if (!user) return <div>Cargando...</div>;

    return (
        <Layout style={{ height: "calc(100vh)" }}>
            <Layout style={{ height: "calc(100vh)" }}>
                <Sider className="sider" width={250}>
                    <div>
                        <p onClick={() => handleMenuClick({ key: "informacion" })}>Información Personal</p>
                        <p onClick={() => handleMenuClick({ key: "usuarios" })}>Administrar Usuarios</p>
                        <p onClick={() => handleMenuClick({ key: "catalogo" })}>Catálogo de Productos</p>
                        <p onClick={() => handleMenuClick({ key: "ventas" })}>Historial de Ventas</p>
                    </div>
                </Sider>
                <Layout>
                    <Content className="content" style={{ marginLeft: "250px", paddingBottom: "40px" }}>
                        {showUsers ? (
                        <div style={{ padding: "20px" }}>
                            <h2>Administrar Usuarios</h2>
                            <Table
                            dataSource={users}
                            columns={[
                                { title: "Nombre", dataIndex: "nombre", key: "nombre" },
                                { title: "ID", dataIndex: "id_usuario", key: "id_usuario" },
                                { title: "Apellido", dataIndex: "apellido", key: "apellido" },
                                { title: "Email", dataIndex: "email", key: "email" },
                                { title: "Direccion", dataIndex: "direccion", key: "direccion" },
                                { title: "Teléfono", dataIndex: "telefono", key: "telefono" },
                                { title: "Rol", dataIndex: "rol", key: "rol" },
                                { title: "Acciones", key: "acciones", render: (text, record) => <button>Gestionar</button> },
                            ]}
                            rowKey="id_usuario"
                            />
                        </div>
                        ) : showCatalogo ? (
                        <div style={{ padding: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems:"center" }}>
                                <h2>Catálogo de Productos</h2>
                                <button onClick={() => setIsModalOpen(true)} style={{ marginBottom: "10px" }}>
                                    Agregar Producto
                                </button>
                            </div>
                            <Table
                                dataSource={productosData}
                                columns={[
                                    { title: "ID", dataIndex: "id_producto", key: "id_producto" },
                                    { title: "Nombre", dataIndex: "nombre_producto", key: "nombre_producto" },
                                    { title: "Stock", dataIndex: "stock", key: "stock" },
                                    { title: "Precio", dataIndex: "precio", key: "precio" },
                                    { title: "Categorias", dataIndex: "tags", key: "tags" },
                                    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
                                    //{ title: "Acciones", key: "acciones", render: (text, record) => <button>Editar</button> },
                                    { 
                                        title: "Acciones", 
                                        key: "acciones", 
                                        render: (_, record) => (
                                            <button onClick={() => handleEditProduct(record)}>Editar</button>
                                        )
                                    },
                            ]}
                            rowKey="id_producto"
                            />
                            <Modal title="Agregar Producto" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                                <Form layout="vertical" onFinish={handleAddProduct}>
                                    <Form.Item name="nombre_producto" label="Nombre" rules={[{ required: true, message: "Ingresa un nombre" }]}> <Input /> </Form.Item>
                                    <Form.Item name="stock" label="Stock" rules={[{ required: true, message: "Ingresa el stock" }]} normalize={value => Number(value)}> <InputNumber min={1} /> </Form.Item>
                                    <Form.Item name="precio" label="Precio" rules={[{ required: true, message: "Ingresa el precio" }]} normalize={value => Number(value)}> <InputNumber min={0} /> </Form.Item>
                                    <Form.Item name="categorias" label="Categorias" rules={[{ required: true, message: "Ingresa una categoria" }]}> <Input /> </Form.Item>
                                    <Form.Item name="descripcion" label="Descripción" rules={[{ required: true, message: "Ingresa una descripción" }]}> <div><Input.TextArea /></div> </Form.Item>    
                                    <button type="submit">Agregar</button>
                                </Form>
                            </Modal>
                            <Modal 
                                title="Editar Producto" 
                                open={isEditModalOpen} 
                                onCancel={() => setIsEditModalOpen(false)} 
                                footer={null}
                            >
                                <Form 
                                    form={form}
                                    layout="vertical" 
                                    onFinish={handleUpdateProduct} 
                                    initialValues={editingProduct}
                                >
                                    <Form.Item name="nombre_producto" label="Nombre" rules={[{ required: true }]} >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="stock" label="Stock" rules={[{ required: true }]} normalize={value => Number(value)}>
                                        <InputNumber min={1} />
                                    </Form.Item>
                                    <Form.Item name="precio" label="Precio" rules={[{ required: true }]} normalize={value => Number(value)}>
                                        <InputNumber min={0} />
                                    </Form.Item>
                                    <Form.Item name="tags" label="Categorias" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="descripcion" label="Descripción" rules={[{ required: true }]}>
                                        <Input.TextArea />
                                    </Form.Item>    
                                    <button type="primary" htmlType="submit">
                                        Guardar Cambios
                                    </button>
                                </Form>
                            </Modal>
                        </div>
                        ) : showVentas ? (
                        <div style={{ padding: "20px" }}>
                            <h2>Historial de Ventas</h2>
                            <Table
                            //scroll={{ x: 'max-content'}}
                            dataSource={Array.isArray(orders) ? orders : []}
                            columns={[
                                { title: "ID Compra", dataIndex: "id_compra", key: "id_compra" },
                                { title: "Estado", dataIndex: "estado", key: "estado" },
                                { title: "Nombre Cliente", dataIndex: "nombre_cliente", key: "nombre_cliente" },
                                { title: "Dirección", dataIndex: "direccion", key: "direccion" },
                                { title: "ID Cliente", dataIndex: "id_usuario", key: "id_usuario" },
                                { title: "Fecha de la Orden", dataIndex: "fecha_compra", key: "fecha_compra" },
                                { title: "Total", dataIndex: "precio_total", key: "precio_total" },
                            ]}
                            rowKey="id_compra"
                            expandable={{
                                expandedRowRender: (record) => (
                                    <div>
                                    <Title level={5} style={{ marginBottom: "10px" }}>🛒 Detalle de la Compra</Title>
                                    <Table
                                        dataSource={record.detalle}
                                        columns={[
                                            { title: "Producto", dataIndex: "nombre_producto", key: "nombre_producto" },
                                            { title: "Cantidad", dataIndex: "cantidad", key: "cantidad" },
                                            { title: "Precio Unitario", dataIndex: "precio_unitario", key: "precio_unitario" },
                                            { title: "Subtotal", dataIndex: "subtotal", key: "subtotal" },
                                        ]}
                                        rowKey="id_producto"
                                        pagination={false}
                                    />
                                </div>
                                ),
                                columnTitle: "Detalle",
                                }}
                            />
                        </div>
                        ) : (
                        <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            {/* <img src={user.imagen_perfil} alt="Perfil de usuario" /> */}
                            <AdminPanelSettingsIcon style={{ fontSize: "60px", color: "lightgreen" }} />
                            <h2>Panel de Administrador</h2>
                            {/* <p>Bienvenido, administrador!</p> */}
                            {/* <h4>Información del usuario:</h4> */}
                            <div style={{ display: "flex", flexDirection: "column", width: "300px"}}>
                                {["nombre", "apellido", "email", "telefono", "rol"].map((field) => (
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

export default AdminPanel;
