import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ControlOutlined,
  EditOutlined,
  LogoutOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/shared/context/AuthContext";
import { Layout, Table, Typography, Button, Modal, Form, Input, InputNumber } from "antd";
import AppFooter from "@/shared/components/Footer";
import { api } from "@/shared/lib/api";
import {
  categoriaSchema,
  ordersResponseSchema,
  productSchema,
  userSchema,
  type Categoria,
  type Order,
  type Product,
  type User,
} from "@/shared/schemas";
import { confirmAction, showError, showSuccess } from "@/shared/lib/alerts";

const { Sider, Content } = Layout;
const { Title } = Typography;

const AdminPanel = () => {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [productosData, setProductosData] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [showUsers, setShowUsers] = useState(false);
  const [showCatalogo, setShowCatalogo] = useState(false);
  const [showVentas, setShowVentas] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (userRole !== "admin") {
      navigate("/");
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [usersRes, productosRes, ordersRes, categoriasRes] = await Promise.all([
          api.get<unknown>("/auth/usuarios/", token),
          api.get<unknown>("/productos/", token),
          api.get<unknown>("/pedidos/", token),
          api.get<unknown>("/productos/categorias", token),
        ]);

        const parsedUsers = userSchema.array().parse(usersRes);
        const parsedProductos = productSchema.array().parse(productosRes);
        const parsedOrders = ordersResponseSchema.parse(ordersRes);
        const parsedCategorias = categoriaSchema.array().parse(categoriasRes);

        setUsers(parsedUsers);
        setProductosData(parsedProductos);
        setOrders(parsedOrders.orders);
        setCategorias(parsedCategorias);

        const adminUser = parsedUsers.find(
          (u) => u.id_usuario === 1 || u.rol === "admin",
        );
        setUser(adminUser ?? null);
        setUserData(adminUser ?? null);
      } catch (error) {
        console.log("Error al cargar datos desde la API: ", error);
      }
    };

    fetchData();
  }, [userRole, navigate]);

  const handleMenuClick = (key: string) => {
    setShowUsers(key === "usuarios");
    setShowCatalogo(key === "catalogo");
    setShowVentas(key === "ventas");
  };

  const handleAddProduct = async (values: Record<string, unknown>) => {
    try {
      const token = localStorage.getItem("token");
      const { imagen, ...product } = values;

      const nuevoProducto = await api.post<Product>("/productos/", product, token);
      const idProducto = nuevoProducto.id_producto;

      await api.post(
        "/productos/imagenes",
        { id_producto: idProducto, url: imagen },
        token,
      );

      setProductosData([...productosData, nuevoProducto]);
      form.resetFields();
      setIsModalOpen(false);
      await showSuccess("Producto agregado", "El producto se creó correctamente.");
    } catch (error) {
      console.log("Error al agregar producto: ", error);
      await showError("Error", "No se pudo agregar el producto.");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = await confirmAction(
      "¿Eliminar producto?",
      "Esta acción no se puede deshacer.",
      "Eliminar",
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/productos/${product.id_producto}`, token);
      setProductosData((prev) =>
        prev.filter((p) => p.id_producto !== product.id_producto),
      );
      await showSuccess("Producto eliminado");
    } catch (error) {
      console.log("Error al eliminar producto: ", error);
      await showError("Error", "No se pudo eliminar el producto.");
    }
  };

  const handleUpdateProduct = async (values: Record<string, unknown>) => {
    if (!editingProduct) return;

    try {
      const updated = { ...editingProduct, ...values } as Product;
      const token = localStorage.getItem("token");

      await api.put(`/productos/${editingProduct.id_producto}`, updated, token);

      setProductosData((prev) =>
        prev.map((p) =>
          p.id_producto === editingProduct.id_producto ? updated : p,
        ),
      );
      setIsEditModalOpen(false);
      setEditingProduct(null);
      await showSuccess("Producto actualizado");
    } catch (error) {
      console.log("Error al actualizar producto: ", error);
      await showError("Error", "No se pudo actualizar el producto.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSave = () => {
    if (userData) setUser(userData);
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <Layout style={{ height: "calc(100vh)" }}>
      <Layout style={{ height: "calc(100vh)" }}>
        <Sider className="sider" width={250}>
          <div>
            <p onClick={() => handleMenuClick("informacion")}>Información Personal</p>
            <p onClick={() => handleMenuClick("usuarios")}>Administrar Usuarios</p>
            <p onClick={() => handleMenuClick("catalogo")}>Catálogo de Productos</p>
            <p onClick={() => handleMenuClick("ventas")}>Historial de Ventas</p>
          </div>
        </Sider>
        <Layout>
          <Content className="content" style={{ marginLeft: "250px", paddingBottom: "40px" }}>
            {showUsers ? (
              <div style={{ padding: "20px" }}>
                <h2>Administrar Usuarios</h2>
                <Table
                  dataSource={users}
                  scroll={{ x: "max-content" }}
                  columns={[
                    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
                    { title: "ID", dataIndex: "id_usuario", key: "id_usuario" },
                    { title: "Apellido", dataIndex: "apellido", key: "apellido" },
                    { title: "Email", dataIndex: "email", key: "email" },
                    { title: "Direccion", dataIndex: "direccion", key: "direccion" },
                    { title: "Teléfono", dataIndex: "telefono", key: "telefono" },
                    { title: "Rol", dataIndex: "rol", key: "rol" },
                  ]}
                  rowKey="id_usuario"
                />
              </div>
            ) : showCatalogo ? (
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h2>Catálogo de Productos</h2>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    style={{ marginBottom: "10px" }}
                  >
                    Agregar Producto
                  </button>
                </div>
                <Table
                  dataSource={productosData}
                  scroll={{ x: "max-content" }}
                  columns={[
                    { title: "ID", dataIndex: "id_producto", key: "id_producto" },
                    { title: "Nombre", dataIndex: "nombre_producto", key: "nombre_producto" },
                    { title: "Stock", dataIndex: "stock", key: "stock" },
                    { title: "Precio", dataIndex: "precio", key: "precio" },
                    {
                      title: "Descripción",
                      dataIndex: "descripcion",
                      key: "descripcion",
                      render: (text: string) =>
                        text.length > 50 ? `${text.slice(0, 50)}...` : text,
                    },
                    {
                      title: "Editar",
                      key: "editar",
                      render: (_: unknown, record: Product) => (
                        <button type="button" onClick={() => handleEditProduct(record)}>
                          Editar
                        </button>
                      ),
                    },
                    {
                      title: "Eliminar",
                      key: "eliminar",
                      render: (_: unknown, record: Product) => (
                        <button type="button" onClick={() => handleDeleteProduct(record)}>
                          Eliminar
                        </button>
                      ),
                    },
                  ]}
                  rowKey="id_producto"
                />
                <Modal
                  title="Agregar Producto"
                  open={isModalOpen}
                  onCancel={() => {
                    form.resetFields();
                    setIsModalOpen(false);
                  }}
                  footer={null}
                >
                  <Form form={form} layout="vertical" onFinish={handleAddProduct}>
                    <Form.Item
                      name="nombre_producto"
                      label="Nombre"
                      rules={[{ required: true, message: "Ingresa un nombre" }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="stock"
                      label="Stock"
                      rules={[{ required: true, message: "Ingresa el stock" }]}
                      normalize={(value) => Number(value)}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                      name="precio"
                      label="Precio"
                      rules={[{ required: true, message: "Ingresa el precio" }]}
                      normalize={(value) => Number(value)}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                      name="imagen"
                      label="Imagen"
                      rules={[{ required: true, message: "Ingresa una url de imagen" }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="descripcion"
                      label="Descripción"
                      rules={[{ required: true, message: "Ingresa una descripción" }]}
                    >
                      <Input.TextArea />
                    </Form.Item>
                    <Button className="Button" type="default" htmlType="submit">
                      Agregar
                    </Button>
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
                    initialValues={editingProduct ?? undefined}
                  >
                    <Form.Item
                      name="nombre_producto"
                      label="Nombre"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="stock"
                      label="Stock"
                      rules={[{ required: true }]}
                      normalize={(value) => Number(value)}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                      name="precio"
                      label="Precio"
                      rules={[{ required: true }]}
                      normalize={(value) => Number(value)}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                      name="descripcion"
                      label="Descripción"
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea />
                    </Form.Item>
                    <Button type="default" htmlType="submit">
                      Guardar Cambios
                    </Button>
                  </Form>
                </Modal>
              </div>
            ) : showVentas ? (
              <div style={{ padding: "20px" }}>
                <h2>Historial de Ventas</h2>
                <Table
                  dataSource={Array.isArray(orders) ? orders : []}
                  scroll={{ x: "max-content" }}
                  columns={[
                    { title: "ID Compra", dataIndex: "id_compra", key: "id_compra" },
                    { title: "Estado", dataIndex: "estado", key: "estado" },
                    {
                      title: "Nombre Cliente",
                      key: "nombre_cliente",
                      render: (record: Order) => {
                        const usuario = users.find((u) => u.id_usuario === record.id_usuario);
                        return usuario ? usuario.nombre : "Desconocido";
                      },
                    },
                    { title: "Dirección", dataIndex: "direccion", key: "direccion" },
                    { title: "ID Cliente", dataIndex: "id_usuario", key: "id_usuario" },
                    {
                      title: "Fecha de la Orden",
                      dataIndex: "fecha_compra",
                      key: "fecha_compra",
                      render: (text: string) =>
                        new Date(text).toLocaleString("es-CL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                    },
                    { title: "Total", dataIndex: "precio_total", key: "precio_total" },
                  ]}
                  rowKey="id_compra"
                  expandable={{
                    expandedRowRender: (record: Order) => (
                      <div>
                        <Title level={5} style={{ marginBottom: "10px" }}>
                          🛒 Detalle de la Compra
                        </Title>
                        <Table
                          dataSource={record.detalle}
                          columns={[
                            {
                              title: "Producto",
                              dataIndex: "nombre_producto",
                              key: "nombre_producto",
                            },
                            { title: "Cantidad", dataIndex: "cantidad", key: "cantidad" },
                            {
                              title: "Precio Unitario",
                              dataIndex: "precio_unitario",
                              key: "precio_unitario",
                            },
                            { title: "Subtotal", dataIndex: "subtotal", key: "subtotal" },
                          ]}
                          rowKey="id_producto"
                          pagination={false}
                          scroll={{ x: "max-content" }}
                        />
                      </div>
                    ),
                    columnTitle: "Detalle",
                  }}
                />
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
                <ControlOutlined style={{ fontSize: "60px", color: "lightgreen" }} />
                <h2>Panel de Administrador</h2>
                <div style={{ display: "flex", flexDirection: "column", width: "300px" }}>
                  {(["nombre", "apellido", "email", "telefono", "rol"] as const).map(
                    (field) => (
                      <div key={field}>
                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                        {isEditing && userData ? (
                          <Input
                            name={field}
                            value={String(userData[field] ?? "")}
                            onChange={handleInputChange}
                            style={{ width: "100%", marginBottom: "12px" }}
                          />
                        ) : (
                          <p>{String(user[field] ?? "")}</p>
                        )}
                      </div>
                    ),
                  )}
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  {isEditing ? (
                    <Button
                      htmlType="button"
                      onClick={handleSave}
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        padding: "12px 32px 12px 12px",
                      }}
                    >
                      <SaveOutlined style={{ fontSize: "20px" }} />
                      Guardar
                    </Button>
                  ) : (
                    <Button
                      className="Button"
                      type="default"
                      htmlType="button"
                      onClick={() => setIsEditing(true)}
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        padding: "12px 32px 12px 12px",
                      }}
                    >
                      <EditOutlined style={{ fontSize: "20px" }} />
                      Editar
                    </Button>
                  )}

                  <Button
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
                    <LogoutOutlined style={{ fontSize: "20px" }} />
                    Cerrar sesión
                  </Button>
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
