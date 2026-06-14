import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  MailOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useCart } from "@/shared/context/CartContext";
import { useCatalog } from "@/features/catalog/api/catalog.queries";
import AppFooter from "@/shared/components/Footer";
import { savePendingCheckout } from "@/shared/lib/checkoutStorage";
import { checkoutSchema } from "@/shared/schemas";
import { showWarning } from "@/shared/lib/alerts";
import { calculateCartTotal } from "@/shared/lib/cartUtils";
import type { User } from "@/shared/schemas";
import styles from "./CheckoutPage.module.css";

const { Title, Text } = Typography;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1466781783364-36c667e68334?w=200&q=80";

interface CheckoutFormValues {
  nombre: string;
  email: string;
  direccion: string;
  ciudad: string;
}

const CheckoutPage = () => {
  const { cart } = useCart();
  const { imagenes } = useCatalog();
  const navigate = useNavigate();
  const [form] = Form.useForm<CheckoutFormValues>();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") ?? "null") as User | null;

    if (user) {
      form.setFieldsValue({
        nombre: user.nombre || "",
        direccion: user.direccion || "",
        ciudad: user.ciudad || "",
        email: user.email || "",
      });
    }
  }, [form, navigate]);

  const totalPrice = calculateCartTotal(cart);

  const getImage = (productId: number) =>
    imagenes.find((img) => img.id_producto === productId)?.url ?? FALLBACK_IMAGE;

  const handleCheckout = async (values: CheckoutFormValues) => {
    const parsed = checkoutSchema.safeParse(values);

    if (!parsed.success) {
      await showWarning(
        "Campos incompletos",
        parsed.error.errors[0]?.message ??
          "Por favor completa todos los campos.",
      );
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    const detalle = cart.map((item) => ({
      id_producto: item.id_producto,
      nombre_producto: item.nombre_producto,
      cantidad: item.quantity,
      precio_unitario: parseFloat(String(item.precio)),
    }));

    savePendingCheckout({
      id_usuario: parseInt(userId, 10),
      nombre_cliente: parsed.data.nombre,
      email_cliente: parsed.data.email,
      detalle,
      total: totalPrice,
      estado: "pending",
      direccion: parsed.data.direccion,
      ciudad: parsed.data.ciudad,
      cartSnapshot: cart,
    });

    navigate("/checkout/payment");
  };

  if (cart.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Card className={styles.emptyCard}>
            <Empty description="No hay productos para finalizar la compra">
              <Link to="/catalogo">
                <Button type="primary">Ir al catálogo</Button>
              </Link>
            </Empty>
          </Card>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[
            {
              title: (
                <Link to="/">
                  <HomeOutlined /> Inicio
                </Link>
              ),
            },
            { title: "Checkout" },
          ]}
        />

        <Title level={2} className={styles.title}>
          <ShoppingOutlined /> Finalizar compra
        </Title>

        <Form form={form} layout="vertical" onFinish={handleCheckout}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={14}>
              <Card className={styles.card} title="Datos de envío">
                <Form.Item
                  name="nombre"
                  label="Nombre completo"
                  rules={[{ required: true, message: "Ingresa tu nombre" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Nombre y apellido" />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Correo electrónico"
                  rules={[
                    { required: true, message: "Ingresa tu correo" },
                    { type: "email", message: "Correo inválido" },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="tu@email.com" />
                </Form.Item>

                <Form.Item
                  name="direccion"
                  label="Dirección de envío"
                  rules={[{ required: true, message: "Ingresa tu dirección" }]}
                >
                  <Input placeholder="Calle, número, comuna" />
                </Form.Item>

                <Form.Item
                  name="ciudad"
                  label="Ciudad"
                  rules={[{ required: true, message: "Ingresa tu ciudad" }]}
                >
                  <Input placeholder="Ciudad" />
                </Form.Item>
              </Card>

              <Card
                className={`${styles.card} ${styles.itemsCard}`}
                title="Tu pedido"
              >
                <ul className={styles.itemsList}>
                  {cart.map((product) => (
                    <li key={product.id_producto} className={styles.item}>
                      <img
                        src={getImage(product.id_producto)}
                        alt={product.nombre_producto}
                        className={styles.itemImg}
                      />
                      <div className={styles.itemInfo}>
                        <Text strong>{product.nombre_producto}</Text>
                        <Text type="secondary">
                          {product.quantity} × ${product.precio.toFixed(2)}
                        </Text>
                      </div>
                      <Text strong className={styles.itemSubtotal}>
                        ${(product.precio * product.quantity).toFixed(2)}
                      </Text>
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card className={styles.summaryCard} title="Resumen">
                <div className={styles.summaryRow}>
                  <Text>Subtotal ({cart.length} productos)</Text>
                  <Text>${totalPrice.toFixed(2)}</Text>
                </div>
                <div className={styles.summaryRow}>
                  <Text>Envío</Text>
                  <Text type="success">Gratis</Text>
                </div>

                <Divider />

                <div className={styles.summaryTotal}>
                  <Text strong>Total a pagar</Text>
                  <Title level={3} className={styles.summaryPrice}>
                    ${totalPrice.toFixed(2)}
                  </Title>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  htmlType="submit"
                  icon={<CheckCircleOutlined />}
                  className={styles.submitBtn}
                >
                  Continuar al pago
                </Button>

                <Link to="/cart" className={styles.backLink}>
                  <Button block type="link" icon={<ArrowLeftOutlined />}>
                    Volver al carrito
                  </Button>
                </Link>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
      <AppFooter />
    </div>
  );
};

export default CheckoutPage;
