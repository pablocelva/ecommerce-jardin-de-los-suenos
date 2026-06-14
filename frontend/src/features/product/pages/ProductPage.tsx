import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Col,
  Image,
  InputNumber,
  Row,
  Tag,
  Typography,
  Space,
  Divider,
  message,
  Card,
} from "antd";
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useCatalog } from "@/features/catalog/api/catalog.queries";
import { useCart } from "@/shared/context/CartContext";
import AppFooter from "@/shared/components/Footer";

const { Title, Paragraph, Text } = Typography;

const ProductPage = () => {
  const { productos, imagenes } = useCatalog();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const productId = parseInt(id ?? "0", 10);
  const producto = productos.find((item) => item.id_producto === productId);

  if (!producto) {
    return (
      <div className="product-detail-page product-detail-empty">
        <Card>
          <Title level={3}>Producto no encontrado</Title>
          <Paragraph type="secondary">
            La planta que buscas no existe o fue retirada del catálogo.
          </Paragraph>
          <Button type="primary" onClick={() => navigate("/catalogo")}>
            Volver al catálogo
          </Button>
        </Card>
        <AppFooter />
      </div>
    );
  }

  const imagenesProducto = imagenes.filter((img) => img.id_producto === productId);
  const mainImage =
    imagenesProducto[0]?.url ??
    "https://images.unsplash.com/photo-1466781783364-36c667e68334?w=800&q=80";
  const inStock = producto.stock > 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addToCart(producto);
    }
    message.success(
      `${quantity} × ${producto.nombre_producto} añadido${quantity > 1 ? "s" : ""} al carrito`,
    );
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <Breadcrumb
          className="product-breadcrumb"
          items={[
            {
              title: (
                <Link to="/">
                  <HomeOutlined /> Inicio
                </Link>
              ),
            },
            {
              title: <Link to="/catalogo">Catálogo</Link>,
            },
            { title: producto.nombre_producto },
          ]}
        />

        <Row gutter={[32, 32]} align="top">
          <Col xs={24} md={12}>
            <div className="product-gallery">
              <Image.PreviewGroup>
                <div className="product-main-image-wrap">
                  <Image
                    src={mainImage}
                    alt={producto.nombre_producto}
                    className="product-main-image"
                  />
                </div>
                {imagenesProducto.length > 1 && (
                  <div className="product-thumbnails">
                    {imagenesProducto.map((img) => (
                      <Image
                        key={img.id_imagen ?? img.url}
                        src={img.url}
                        alt={`Vista de ${producto.nombre_producto}`}
                        width={80}
                        height={80}
                        className="product-thumbnail"
                      />
                    ))}
                  </div>
                )}
              </Image.PreviewGroup>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="product-info">
              <Space wrap>
                <Tag color={inStock ? "success" : "error"} icon={<CheckCircleOutlined />}>
                  {inStock ? `${producto.stock} disponibles` : "Agotado"}
                </Tag>
                <Tag color="green">Planta</Tag>
              </Space>

              <Title level={2} className="product-detail-title">
                {producto.nombre_producto}
              </Title>

              <Title level={3} className="product-detail-price">
                ${producto.precio.toFixed(2)}
              </Title>

              <Paragraph className="product-detail-description">
                {producto.descripcion}
              </Paragraph>

              <Divider />

              <div className="product-detail-actions">
                <Text strong>Cantidad</Text>
                <InputNumber
                  min={1}
                  max={producto.stock}
                  value={quantity}
                  onChange={(val) => setQuantity(val ?? 1)}
                  disabled={!inStock}
                  size="large"
                  className="product-quantity-input"
                />

                <Space wrap size="middle" className="product-buttons">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    disabled={!inStock}
                    onClick={handleAddToCart}
                  >
                    Añadir al carrito
                  </Button>
                  <Button
                    size="large"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                  >
                    Volver
                  </Button>
                </Space>
              </div>

              <Card size="small" className="product-tip-card">
                <Text type="secondary">
                  🌱 Todas nuestras plantas se preparan con cuidado antes del envío.
                  Consulta nuestras guías de cuidado según el tipo de planta.
                </Text>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
      <AppFooter />
    </div>
  );
};

export default ProductPage;
