import { Link } from "react-router-dom";
import { Layout, Typography, Row, Col, Space } from "antd";
import styles from "./Footer.module.css";
import {
  MailOutlined,
  PhoneOutlined,
  InstagramOutlined,
  FacebookOutlined,
  TwitterOutlined,
  BranchesOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Title } = Typography;

const AppFooter = () => {
  const year = new Date().getFullYear();

  return (
    <Footer className={styles.root}>
      <div className={styles.inner}>
        <Row gutter={[32, 32]} justify="space-between">
          <Col xs={24} sm={24} md={8}>
            <div>
              <Title level={4} className={styles.brandTitle}>
                <BranchesOutlined className={styles.brandIcon} />
                Jardin de los Sueños
              </Title>
              <Text className={styles.brandText}>
                Plantas, flores y decoración natural para transformar tu hogar
                en un oasis verde.
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Title level={5} className={styles.sectionTitle}>
              Enlaces
            </Title>
            <Space direction="vertical" size={4} className={styles.links}>
              <Link to="/">Inicio</Link>
              <Link to="/catalogo">Catálogo</Link>
              <Link to="/blogs">Blog</Link>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/register">Crear cuenta</Link>
              <Typography.Link href="#">Políticas de privacidad</Typography.Link>
              <Typography.Link href="#">Términos y condiciones</Typography.Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Title level={5} className={styles.sectionTitle}>
              Contacto
            </Title>
            <Space direction="vertical" size={8} className={styles.contact}>
              <Typography.Link href="tel:+56222333444">
                <PhoneOutlined /> +56 2 2233 3444
              </Typography.Link>
              <Typography.Link href="mailto:jardindelosuenos@gmail.com">
                <MailOutlined /> jardindelosuenos@gmail.com
              </Typography.Link>
            </Space>
            <div className={styles.social}>
              <Typography.Link
                href="https://www.instagram.com/jardindelosuenos/"
                aria-label="Instagram"
                className={styles.socialLink}
              >
                <InstagramOutlined />
              </Typography.Link>
              <Typography.Link
                href="https://www.facebook.com/jardindelosuenos"
                aria-label="Facebook"
                className={styles.socialLink}
              >
                <FacebookOutlined />
              </Typography.Link>
              <Typography.Link
                href="https://www.twitter.com/jardindelosuenos"
                aria-label="Twitter"
                className={styles.socialLink}
              >
                <TwitterOutlined />
              </Typography.Link>
            </div>
          </Col>
        </Row>

        <div className={styles.bottom}>
          <Text>© {year} Jardin de los Sueños. Todos los derechos reservados.</Text>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
