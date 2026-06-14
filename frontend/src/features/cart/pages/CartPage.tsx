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

const { Title, Text } = Typography;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1466781783364-36c667e68334?w=200&q=80";

const CartPage = () => {
  const { cart, removeFromCart, updateCart } = useCart();
  const { imagenes } = useCatalog();
  const navigate = useNavigate();

  const getImage = (productId: number) =>
    imagenes.find((img) => img.id_producto === productId)?.url ?? FALLBACK_IMAGE;

  const totalPrice = cart.reduce(
    (acc, product) => acc + product.precio * product.quantity,
    0,
  );

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    updateCart(
      cart.map((item) =>
        item.id_producto === productId ? { ...item, quantity } : item,
      ),
    );
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <Breadcrumb
          className="cart-breadcrumb"
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

        <Title level={2} className="cart-title">
          <ShoppingCartOutlined /> Carrito de compras
        </Title>

        {cart.length === 0 ? (
          <Card className="cart-empty-card">
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
              <div className="cart-items-list">
                {cart.map((product) => (
                  <Card key={product.id_producto} className="cart-item-card">
                    <div className="cart-item">
                      <img
                        src={getImage(product.id_producto)}
                        alt={product.nombre_producto}
                        className="cart-item-img"
                      />
                      <div className="cart-item-details">
                        <Title level={5}>{product.nombre_producto}</Title>
                        <Text type="secondary">
                          ${product.precio.toFixed(2)} c/u
                        </Text>
                        <div className="cart-item-controls">
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
                      <div className="cart-item-side">
                        <Text strong className="cart-item-subtotal">
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
              <Card className="cart-summary-card" title="Resumen del pedido">
                <div className="cart-summary-row">
                  <Text>Productos ({cart.length})</Text>
                  <Text>${totalPrice.toFixed(2)}</Text>
                </div>
                <div className="cart-summary-row">
                  <Text>Envío</Text>
                  <Text type="success">Gratis</Text>
                </div>
                <div className="cart-summary-total">
                  <Text strong>Total</Text>
                  <Title level={3} className="cart-summary-price">
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
                <Link to="/catalogo" className="cart-continue-link">
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
