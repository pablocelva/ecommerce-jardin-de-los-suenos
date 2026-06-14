import { Button, Drawer, Empty, Typography } from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/shared/context/CartContext";
import { useCatalog } from "@/features/catalog/api/catalog.queries";

const { Text, Title } = Typography;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1466781783364-36c667e68334?w=200&q=80";

const CartDrawer = () => {
  const {
    cart,
    cartDrawerOpen,
    closeCartDrawer,
    removeFromCart,
    updateCart,
  } = useCart();
  const { imagenes } = useCatalog();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0,
  );

  const getImage = (productId: number) =>
    imagenes.find((img) => img.id_producto === productId)?.url ?? FALLBACK_IMAGE;

  const changeQuantity = (productId: number, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id_producto !== productId) return item;
        const nextQty = item.quantity + delta;
        return nextQty > 0 ? { ...item, quantity: nextQty } : item;
      })
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };

  const handleViewCart = () => {
    closeCartDrawer();
    navigate("/cart");
  };

  return (
    <Drawer
      title={
        <span className="cart-drawer-title">
          <ShoppingCartOutlined /> Tu carrito
        </span>
      }
      placement="right"
      width={400}
      onClose={closeCartDrawer}
      open={cartDrawerOpen}
      className="cart-drawer"
      footer={
        cart.length > 0 ? (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-total">
              <Text>Total</Text>
              <Title level={4} className="cart-drawer-total-price">
                ${total.toFixed(2)}
              </Title>
            </div>
            <Button type="primary" block size="large" onClick={handleViewCart}>
              Ver carrito completo
            </Button>
          </div>
        ) : null
      }
    >
      {cart.length === 0 ? (
        <Empty
          description="Tu carrito está vacío"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="cart-drawer-empty"
        />
      ) : (
        <ul className="cart-drawer-list">
          {cart.map((item) => (
            <li key={item.id_producto} className="cart-drawer-item">
              <img
                src={getImage(item.id_producto)}
                alt={item.nombre_producto}
                className="cart-drawer-item-img"
              />
              <div className="cart-drawer-item-info">
                <Text strong className="cart-drawer-item-name">
                  {item.nombre_producto}
                </Text>
                <Text type="secondary">${item.precio.toFixed(2)} c/u</Text>
                <div className="cart-drawer-item-actions">
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => changeQuantity(item.id_producto, -1)}
                    aria-label="Disminuir cantidad"
                  />
                  <Text>{item.quantity}</Text>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => changeQuantity(item.id_producto, 1)}
                    aria-label="Aumentar cantidad"
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(item.id_producto)}
                    aria-label="Eliminar producto"
                  />
                </div>
              </div>
              <Text strong className="cart-drawer-item-subtotal">
                ${(item.precio * item.quantity).toFixed(2)}
              </Text>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
};

export default CartDrawer;
