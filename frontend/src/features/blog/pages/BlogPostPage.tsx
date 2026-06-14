import { useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Button, Card, Tag, Typography } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AppFooter from "@/shared/components/Footer";
import CardCarousel from "@/shared/components/CardCarousel";
import { useCatalog } from "@/features/catalog/api/catalog.queries";
import { getBlogPostBySlug } from "@/features/blog/data/blogPosts";

const { Title, Paragraph, Text } = Typography;

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
    <div className="blog-post-page">
      <div
        className="blog-post-hero"
        style={{ backgroundImage: `url(${post.image})` }}
      >
        <div className="blog-post-hero-overlay" />
        <div className="blog-post-hero-content">
          <Breadcrumb
            className="blog-post-breadcrumb"
            items={[
              {
                title: (
                  <Link to="/">
                    <HomeOutlined /> Inicio
                  </Link>
                ),
              },
              {
                title: <Link to="/blogs">Blog</Link>,
              },
              { title: post.title },
            ]}
          />
          <Title level={1} className="blog-post-title">
            {post.title}
          </Title>
          <div className="blog-post-meta">
            <Text>
              <UserOutlined /> {post.author}
            </Text>
            <Text>
              <CalendarOutlined />{" "}
              {new Date(post.date).toLocaleDateString("es-CL", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Text>{post.readTime} de lectura</Text>
          </div>
        </div>
      </div>

      <div className="blog-post-body">
        <article className="blog-post-container">
          <div className="blog-post-tags">
            {post.tags.map((tag) => (
              <Tag key={tag} color="green">
                {tag}
              </Tag>
            ))}
          </div>

          <Paragraph className="blog-post-excerpt">{post.excerpt}</Paragraph>

          {post.content.map((paragraph) => (
            <Paragraph
              key={paragraph.slice(0, 40)}
              className="blog-post-paragraph"
            >
              {paragraph}
            </Paragraph>
          ))}

          <Link to="/blogs">
            <Button icon={<ArrowLeftOutlined />} className="blog-post-back-btn">
              Volver al blog
            </Button>
          </Link>
        </article>

        {relatedProducts.length > 0 && (
          <section className="blog-post-related">
            <div className="blog-post-related-inner">
              <Title level={3} className="blog-post-related-title">
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
                className="products-carousel blog-related-carousel"
              >
                {relatedProducts.map((producto) => (
                  <div
                    key={producto.id_producto}
                    className="product-carousel-slide"
                  >
                    <Card
                      hoverable
                      className="product-mini-card"
                      cover={
                        <img
                          src={getProductImage(producto.id_producto)}
                          alt={producto.nombre_producto}
                        />
                      }
                      onClick={() =>
                        navigate(`/product/${producto.id_producto}`)
                      }
                    >
                      <Text strong>{producto.nombre_producto}</Text>
                      <Text className="product-mini-price">
                        ${producto.precio.toFixed(2)}
                      </Text>
                    </Card>
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
