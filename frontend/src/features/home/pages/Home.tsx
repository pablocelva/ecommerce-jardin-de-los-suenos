import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Rate,
  Row,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowRightOutlined,
  ReadOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useCatalog } from "@/features/catalog/api/catalog.queries";
import { fetchProductsByCategory } from "@/features/catalog/api/catalog.api";
import { useCart } from "@/shared/context/CartContext";
import BannerCarousel from "@/shared/components/Carousel";
import CardCarousel from "@/shared/components/CardCarousel";
import ProductCard from "@/shared/components/ProductCard";
import AppFooter from "@/shared/components/Footer";
import { BLOG_POSTS } from "@/features/blog/data/blogPosts";
import styles from "./Home.module.css";
import { CARD_CAROUSEL_SLIDE_CLASS } from "@/shared/components/CardCarousel";

const { Title, Paragraph, Text } = Typography;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1466781783364-36c667e68334?w=600&q=80";

const reviews = [
  {
    name: "María González",
    text: "Las plantas llegaron en perfecto estado. Mi living se transformó por completo.",
    rating: 5,
  },
  {
    name: "Carlos Ruiz",
    text: "Excelente asesoría y entrega rápida. Volveré a comprar sin duda.",
    rating: 5,
  },
  {
    name: "Ana Torres",
    text: "Gran variedad y precios justos. Las suculentas son hermosas.",
    rating: 4,
  },
];

const blogPosts = BLOG_POSTS;

const Home = () => {
  const { productos, categorias, imagenes, loading } = useCatalog();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [categoryImages, setCategoryImages] = useState<Record<number, string>>(
    {},
  );
  const [loadingCategoryImages, setLoadingCategoryImages] = useState(false);

  const featuredProducts = useMemo(
    () => productos.filter((p) => p.stock > 0).slice(0, 8),
    [productos],
  );

  const offerProducts = useMemo(
    () => productos.filter((p) => p.stock > 0).slice(0, 3),
    [productos],
  );

  const getProductImage = (id: number) =>
    imagenes.find((img) => img.id_producto === id)?.url ?? FALLBACK_IMAGE;

  const goToProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (producto: (typeof productos)[number]) => {
    addToCart(producto);
    message.success(`${producto.nombre_producto} añadido al carrito`);
  };

  useEffect(() => {
    if (categorias.length === 0) return;

    const loadCategoryImages = async () => {
      setLoadingCategoryImages(true);

      try {
        const entries = await Promise.all(
          categorias.map(async (cat) => {
            try {
              const products = await fetchProductsByCategory(cat.id_categoria);

              if (products.length === 0) {
                return [cat.id_categoria, FALLBACK_IMAGE] as const;
              }

              const productWithImage = products.find((product) =>
                imagenes.some((img) => img.id_producto === product.id_producto),
              );
              const targetProduct = productWithImage ?? products[0];
              const imageUrl =
                imagenes.find(
                  (img) => img.id_producto === targetProduct.id_producto,
                )?.url ?? FALLBACK_IMAGE;

              return [cat.id_categoria, imageUrl] as const;
            } catch {
              return [cat.id_categoria, FALLBACK_IMAGE] as const;
            }
          }),
        );

        setCategoryImages(Object.fromEntries(entries));
      } finally {
        setLoadingCategoryImages(false);
      }
    };

    void loadCategoryImages();
  }, [categorias, imagenes]);

  const isCategoriesLoading = loading || loadingCategoryImages;

  return (
    <div className={styles.page}>
      <BannerCarousel />

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <Title level={2} className={styles.sectionTitle}>
              Explora por tipo de planta
            </Title>
            <Paragraph type="secondary">
              Encuentra la categoría perfecta para tu espacio
            </Paragraph>
          </div>

          {isCategoriesLoading ? (
            <div className={styles.loading}>
              <Spin size="large" />
            </div>
          ) : (
            <CardCarousel
              slidesToShow={Math.min(categorias.length, 4)}
              slidesToScroll={1}
              responsive={[
                { breakpoint: 1200, settings: { slidesToShow: 3 } },
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } },
              ]}
              className="category-carousel"
            >
              {categorias.map((cat) => (
                <div key={cat.id_categoria} className={CARD_CAROUSEL_SLIDE_CLASS}>
                  <Card
                    hoverable
                    className={styles.categoryCard}
                    cover={
                      <img
                        alt={cat.nombre_categoria}
                        src={
                          categoryImages[cat.id_categoria] ?? FALLBACK_IMAGE
                        }
                        className={styles.categoryCardImg}
                      />
                    }
                    onClick={() =>
                      navigate(`/catalogo/categoria/${cat.id_categoria}`)
                    }
                  >
                    <Title level={4} className={styles.categoryCardTitle}>
                      {cat.nombre_categoria}
                    </Title>
                    <Button type="link" icon={<ArrowRightOutlined />}>
                      Ver productos
                    </Button>
                  </Card>
                </div>
              ))}
            </CardCarousel>
          )}
        </div>
      </section>

      <section className={`${styles.section} ${styles.offers}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <Tag icon={<TagOutlined />} color="green" className={styles.tag}>
              Ofertas del mes
            </Tag>
            <Title level={2} className={styles.sectionTitle}>
              Destacados con descuento
            </Title>
          </div>

          <Row gutter={[24, 24]}>
            {offerProducts.map((producto, index) => {
              const discount = [15, 20, 10][index] ?? 15;
              const offerPrice = producto.precio * (1 - discount / 100);

              return (
                <Col key={producto.id_producto} xs={24} md={8}>
                  <ProductCard
                    image={getProductImage(producto.id_producto)}
                    title={producto.nombre_producto}
                    description={producto.descripcion}
                    price={offerPrice}
                    originalPrice={producto.precio}
                    discountPercent={discount}
                    stock={producto.stock}
                    onView={() => goToProduct(producto.id_producto)}
                    onAddToCart={() => handleAddToCart(producto)}
                  />
                </Col>
              );
            })}
          </Row>

          <div className={styles.ctaInline}>
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate("/catalogo")}
            >
              Ver todo el catálogo
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <Title level={2} className={styles.sectionTitle}>
              Lo que dicen nuestros clientes
            </Title>
          </div>

          <Row gutter={[24, 24]}>
            {reviews.map((review) => (
              <Col key={review.name} xs={24} md={8}>
                <Card className={styles.reviewCard}>
                  <Rate disabled defaultValue={review.rating} />
                  <Paragraph className={styles.reviewText}>{review.text}</Paragraph>
                  <Text strong>{review.name}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className={`${styles.section} ${styles.blog}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <Title level={2} className={styles.sectionTitle}>
              <ReadOutlined /> Tips de jardinería
            </Title>
            <Paragraph type="secondary">
              Consejos para cuidar tus plantas como un experto
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {blogPosts.map((post) => (
              <Col key={post.slug} xs={24} md={8}>
                <Link to={`/blogs/${post.slug}`} className={styles.blogCardLink}>
                  <Card
                    hoverable
                    className={styles.blogCard}
                    cover={
                      <img
                        alt={post.title}
                        src={post.image}
                        className={styles.blogCardImg}
                      />
                    }
                  >
                    <Title level={5}>{post.title}</Title>
                    <Paragraph type="secondary">{post.excerpt}</Paragraph>
                    <Button type="link">Leer más</Button>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
          <div className={styles.ctaInline}>
            <Link to="/blogs">
              <Button type="link" icon={<ReadOutlined />}>
                Ver todos los artículos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <Title level={2} className={styles.sectionTitle}>
                Productos populares
              </Title>
            </div>

            <CardCarousel
              slidesToShow={4}
              slidesToScroll={2}
              responsive={[
                { breakpoint: 1200, settings: { slidesToShow: 3 } },
                { breakpoint: 992, settings: { slidesToShow: 2 } },
                { breakpoint: 576, settings: { slidesToShow: 1 } },
              ]}
            >
              {featuredProducts.map((producto) => (
                <div key={producto.id_producto} className={CARD_CAROUSEL_SLIDE_CLASS}>
                  <ProductCard
                    image={getProductImage(producto.id_producto)}
                    title={producto.nombre_producto}
                    description={producto.descripcion}
                    price={producto.precio}
                    stock={producto.stock}
                    onView={() => goToProduct(producto.id_producto)}
                    onAddToCart={() => handleAddToCart(producto)}
                  />
                </div>
              ))}
            </CardCarousel>
          </div>
        </section>
      )}

      <section className={styles.ctaBanner}>
        <div className={`${styles.container} ${styles.ctaInner}`}>
          <div>
            <Title level={2} className={styles.ctaTitle}>
              ¿Listo para llenar tu hogar de verde?
            </Title>
            <Paragraph className={styles.ctaText}>
              Explora nuestro catálogo completo con filtros por categoría, precio
              y disponibilidad.
            </Paragraph>
          </div>
          <Link to="/catalogo">
            <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
              Ir al catálogo
            </Button>
          </Link>
        </div>
      </section>

      <AppFooter />
    </div>
  );
};

export default Home;
