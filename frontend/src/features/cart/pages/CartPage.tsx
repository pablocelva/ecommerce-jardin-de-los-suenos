import { Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  InputNumber,
  Row,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useCart } from "@/shared/context/CartContext";
import { useCatalog } from "@/features/catalog/api/catalog.queries";
import AppFooter from "@/shared/components/Footer";
import {
  calculateCartTotal,
  updateProductQuantity,
} from "@/shared/lib/cartUtils";
import styles from "./CartPage.module.css";

const { Title, Text } = Typography;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1466781783364-36c667e68334?w=200&q=80";

const CartPage = () => {
  const { cart, removeFromCart, updateCart } = useCart();
  const { imagenes } = useCatalog();
  const navigate = useNavigate();

  const getImage = (productId: number) =>
    imagenes.find((img) => img.id_producto === productId)?.url ?? FALLBACK_IMAGE;

  const totalPrice = calculateCartTotal(cart);

  const updateQuantity = (productId: number, quantity: number) => {
    updateCart(updateProductQuantity(cart, productId, quantity));
  };

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
            { title: "Carrito" },
          ]}
        />

        <Title level={2} className={styles.title}>
          <ShoppingCartOutlined /> Carrito de compras
        </Title>

        {cart.length === 0 ? (
          <Card className={styles.emptyCard}>
            <Empty description="Tu carrito está vacío">
              <Link to="/catalogo">
                <Button type="primary" icon={<ArrowLeftOutlined />}>
                  Explorar catálogo
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <div className={styles.itemsList}>
                {cart.map((product) => (
                  <Card key={product.id_producto} className={styles.itemCard}>
                    <div className={styles.item}>
                      <img
                        src={getImage(product.id_producto)}
                        alt={product.nombre_producto}
                        className={styles.itemImg}
                      />
                      <div className={styles.itemDetails}>
                        <Title level={5}>{product.nombre_producto}</Title>
                        <Text type="secondary">
                          ${product.precio.toFixed(2)} c/u
                        </Text>
                        <div className={styles.itemControls}>
                          <Text>Cantidad:</Text>
                          <InputNumber
                            min={1}
                            max={product.stock}
                            value={product.quantity}
                            onChange={(value) =>
                              updateQuantity(product.id_producto, value ?? 1)
                            }
                          />
                        </div>
                      </div>
                      <div className={styles.itemSide}>
                        <Text strong className={styles.itemSubtotal}>
                          ${(product.precio * product.quantity).toFixed(2)}
                        </Text>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeFromCart(product.id_producto)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <Card className={styles.summaryCard} title="Resumen del pedido">
                <div className={styles.summaryRow}>
                  <Text>Productos ({cart.length})</Text>
                  <Text>${totalPrice.toFixed(2)}</Text>
                </div>
                <div className={styles.summaryRow}>
                  <Text>Envío</Text>
                  <Text type="success">Gratis</Text>
                </div>
                <div className={styles.summaryTotal}>
                  <Text strong>Total</Text>
                  <Title level={3} className={styles.summaryPrice}>
                    ${totalPrice.toFixed(2)}
                  </Title>
                </div>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => navigate("/checkout")}
                >
                  Proceder al pago
                </Button>
                <Link to="/catalogo" className={styles.continueLink}>
                  <Button block type="link">
                    Seguir comprando
                  </Button>
                </Link>
              </Card>
            </Col>
          </Row>
        )}
      </div>
      <AppFooter />
    </div>
  );
};

export default CartPage;
