import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Button, Tag, Typography } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AppFooter from "@/shared/components/Footer";
import CardCarousel, { CARD_CAROUSEL_SLIDE_CLASS } from "@/shared/components/CardCarousel";
import ProductCard from "@/shared/components/ProductCard";
import { useCatalog } from "@/features/catalog/api/catalog.queries";
import { getBlogPostBySlug } from "@/features/blog/data/blogPosts";
import styles from "./BlogPostPage.module.css";

const { Title, Paragraph } = Typography;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1466781783364-36c667e68334?w=600&q=80";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const { productos, imagenes } = useCatalog();
  const navigate = useNavigate();

  const relatedProducts = useMemo(() => {
    if (!post) return [];
    const inStock = productos.filter((p) => p.stock > 0);
    const offset = post.slug.length % Math.max(inStock.length - 4, 1);
    return inStock.slice(offset, offset + 6).length >= 4
      ? inStock.slice(offset, offset + 6)
      : inStock.slice(0, 6);
  }, [post, productos]);

  const getProductImage = (id: number) =>
    imagenes.find((img) => img.id_producto === id)?.url ?? FALLBACK_IMAGE;

  if (!post) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <div className={styles.heroOverlay} aria-hidden />
        <div className={styles.heroInner}>
          <nav className={styles.heroTop} aria-label="Ruta de navegación">
            <Breadcrumb
              className={styles.breadcrumb}
              items={[
                {
                  title: (
                    <Link to="/">
                      <HomeOutlined aria-hidden /> Inicio
                    </Link>
                  ),
                },
                {
                  title: <Link to="/blogs">Blog</Link>,
                },
                { title: post.title },
              ]}
            />
          </nav>
          <div className={styles.heroMain}>
            <Title level={1} className={styles.title}>
              {post.title}
            </Title>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <UserOutlined aria-hidden /> {post.author}
              </span>
              <span className={styles.metaItem}>
                <CalendarOutlined aria-hidden />{" "}
                {new Date(post.date).toLocaleDateString("es-CL", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className={styles.metaItem}>{post.readTime} de lectura</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <article className={styles.article}>
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <Tag key={tag} color="green">
                {tag}
              </Tag>
            ))}
          </div>

          <Paragraph className={styles.excerpt}>{post.excerpt}</Paragraph>

          {post.content.map((paragraph) => (
            <Paragraph
              key={paragraph.slice(0, 40)}
              className={styles.paragraph}
            >
              {paragraph}
            </Paragraph>
          ))}

          <Link to="/blogs">
            <Button icon={<ArrowLeftOutlined />} className={styles.backBtn}>
              Volver al blog
            </Button>
          </Link>
        </article>

        {relatedProducts.length > 0 && (
          <section className={styles.related}>
            <div className={styles.relatedInner}>
              <Title level={3} className={styles.relatedTitle}>
                <ShoppingOutlined /> Productos relacionados
              </Title>
              <Paragraph type="secondary">
                Plantas que combinan con este tema
              </Paragraph>

              <CardCarousel
                slidesToShow={Math.min(relatedProducts.length, 4)}
                slidesToScroll={1}
                responsive={[
                  { breakpoint: 1200, settings: { slidesToShow: 3 } },
                  { breakpoint: 992, settings: { slidesToShow: 2 } },
                  { breakpoint: 576, settings: { slidesToShow: 1 } },
                ]}
                className={styles.relatedCarousel}
              >
                {relatedProducts.map((producto) => (
                  <div
                    key={producto.id_producto}
                    className={CARD_CAROUSEL_SLIDE_CLASS}
                  >
                    <ProductCard
                      image={getProductImage(producto.id_producto)}
                      title={producto.nombre_producto}
                      description={producto.descripcion}
                      price={producto.precio}
                      stock={producto.stock}
                      onView={() => navigate(`/product/${producto.id_producto}`)}
                    />
                  </div>
                ))}
              </CardCarousel>
            </div>
          </section>
        )}
      </div>

      <AppFooter />
    </div>
  );
};

export default BlogPostPage;
