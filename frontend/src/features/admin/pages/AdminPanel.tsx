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
import styles from "./AdminPanel.module.css";
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

  if (!user) return <div className={styles.loading}>Cargando...</div>;

  return (
    <Layout className={styles.root}>
      <Layout className={styles.layout}>
        <Sider className={styles.sider} width={250}>
          <nav className={styles.menu}>
            <p className={styles.menuItem} onClick={() => handleMenuClick("informacion")}>
              Información Personal
            </p>
            <p className={styles.menuItem} onClick={() => handleMenuClick("usuarios")}>
              Administrar Usuarios
            </p>
            <p className={styles.menuItem} onClick={() => handleMenuClick("catalogo")}>
              Catálogo de Productos
            </p>
            <p className={styles.menuItem} onClick={() => handleMenuClick("ventas")}>
              Historial de Ventas
            </p>
          </nav>
        </Sider>
        <Layout>
          <Content className={styles.content}>
            {showUsers ? (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Administrar Usuarios</h2>
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
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Catálogo de Productos</h2>
                  <Button
                    type="primary"
                    className={styles.addProductBtn}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Agregar Producto
                  </Button>
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
                        <Button type="link" onClick={() => handleEditProduct(record)}>
                          Editar
                        </Button>
                      ),
                    },
                    {
                      title: "Eliminar",
                      key: "eliminar",
                      render: (_: unknown, record: Product) => (
                        <Button type="link" danger onClick={() => handleDeleteProduct(record)}>
                          Eliminar
                        </Button>
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
                    <Button className={styles.legacyButton} type="default" htmlType="submit">
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
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Historial de Ventas</h2>
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
                        <Title level={5} className={styles.detailTitle}>
                          Detalle de la Compra
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
              <div className={styles.profilePanel}>
                <ControlOutlined className={styles.profileIcon} />
                <h2 className={styles.profileTitle}>Panel de Administrador</h2>
                <div className={styles.profileFields}>
                  {(["nombre", "apellido", "email", "telefono", "rol"] as const).map(
                    (field) => (
                      <div key={field} className={styles.fieldBlock}>
                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
                        {isEditing && userData ? (
                          <Input
                            name={field}
                            value={String(userData[field] ?? "")}
                            onChange={handleInputChange}
                            className={styles.fieldInput}
                          />
                        ) : (
                          <p>{String(user[field] ?? "")}</p>
                        )}
                      </div>
                    ),
                  )}
                </div>
                <div className={styles.actions}>
                  {isEditing ? (
                    <Button htmlType="button" onClick={handleSave} className={styles.actionBtn}>
                      <SaveOutlined className={styles.actionIcon} />
                      Guardar
                    </Button>
                  ) : (
                    <Button
                      className={`${styles.legacyButton} ${styles.actionBtn}`}
                      type="default"
                      htmlType="button"
                      onClick={() => setIsEditing(true)}
                    >
                      <EditOutlined className={styles.actionIcon} />
                      Editar
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      logout();
                      localStorage.removeItem("userId");
                      navigate("/");
                    }}
                    className={styles.actionBtn}
                  >
                    <LogoutOutlined className={styles.actionIcon} />
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
