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
import {
  calculateCartTotal,
  changeProductQuantity,
} from "@/shared/lib/cartUtils";
import styles from "./CartDrawer.module.css";

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

  const total = calculateCartTotal(cart);

  const getImage = (productId: number) =>
    imagenes.find((img) => img.id_producto === productId)?.url ?? FALLBACK_IMAGE;

  const handleQuantityChange = (productId: number, delta: number) => {
    updateCart(changeProductQuantity(cart, productId, delta));
  };

  const handleViewCart = () => {
    closeCartDrawer();
    navigate("/cart");
  };

  return (
    <Drawer
      title={
        <span className={styles.drawerTitle}>
          <ShoppingCartOutlined /> Tu carrito
        </span>
      }
      placement="right"
      width={400}
      onClose={closeCartDrawer}
      open={cartDrawerOpen}
      footer={
        cart.length > 0 ? (
          <div className={styles.footer}>
            <div className={styles.total}>
              <Text>Total</Text>
              <Title level={4} className={styles.totalPrice}>
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
          className={styles.empty}
        />
      ) : (
        <ul className={styles.list}>
          {cart.map((item) => (
            <li key={item.id_producto} className={styles.item}>
              <img
                src={getImage(item.id_producto)}
                alt={item.nombre_producto}
                className={styles.itemImg}
              />
              <div className={styles.itemInfo}>
                <Text strong className={styles.itemName}>
                  {item.nombre_producto}
                </Text>
                <Text type="secondary">${item.precio.toFixed(2)} c/u</Text>
                <div className={styles.itemActions}>
                  <Button
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => handleQuantityChange(item.id_producto, -1)}
                    aria-label="Disminuir cantidad"
                  />
                  <Text>{item.quantity}</Text>
                  <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => handleQuantityChange(item.id_producto, 1)}
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
              <Text strong className={styles.itemSubtotal}>
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
