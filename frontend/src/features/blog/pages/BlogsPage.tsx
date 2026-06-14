import { Link } from "react-router-dom";
import { Breadcrumb, Card, Col, Row, Tag, Typography } from "antd";
import { CalendarOutlined, HomeOutlined, ReadOutlined } from "@ant-design/icons";
import AppFooter from "@/shared/components/Footer";
import { BLOG_POSTS } from "@/features/blog/data/blogPosts";

const { Title, Paragraph, Text } = Typography;

const BlogsPage = () => {
  return (
    <div className="blogs-page">
      <div className="blogs-container">
        <Breadcrumb
          className="blogs-breadcrumb"
          items={[
            {
              title: (
                <Link to="/">
                  <HomeOutlined /> Inicio
                </Link>
              ),
            },
            { title: "Blog" },
          ]}
        />

        <div className="blogs-header">
          <Title level={2} className="blogs-title">
            <ReadOutlined /> Tips de jardinería
          </Title>
          <Paragraph type="secondary">
            Consejos, guías y tendencias para cuidar y decorar con plantas.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {BLOG_POSTS.map((post) => (
            <Col key={post.slug} xs={24} md={12} lg={8}>
              <Link to={`/blogs/${post.slug}`} className="blog-card-link">
                <Card
                  hoverable
                  className="blog-card blog-list-card"
                  cover={
                    <img
                      alt={post.title}
                      src={post.image}
                      className="blog-card-img"
                    />
                  }
                >
                  <div className="blog-card-meta">
                    <Text type="secondary">
                      <CalendarOutlined />{" "}
                      {new Date(post.date).toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                    <Text type="secondary">{post.readTime}</Text>
                  </div>
                  <Title level={4}>{post.title}</Title>
                  <Paragraph type="secondary" ellipsis={{ rows: 3 }}>
                    {post.excerpt}
                  </Paragraph>
                  <div className="blog-card-tags">
                    {post.tags.map((tag) => (
                      <Tag key={tag} color="green">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
      <AppFooter />
    </div>
  );
};

export default BlogsPage;
