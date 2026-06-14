import type { ReactNode } from "react";
import { Card, Typography } from "antd";
import { BranchesOutlined } from "@ant-design/icons";
import styles from "../styles/auth.module.css";

const { Title, Paragraph } = Typography;

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

const AuthLayout = ({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: AuthLayoutProps) => {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <BranchesOutlined className={styles.heroIcon} />
          <Title level={2} className={styles.heroTitle}>
            Jardin de los Sueños
          </Title>
          <Paragraph className={styles.heroText}>
            Tu tienda de confianza para plantas de interior, exterior y
            decoración natural.
          </Paragraph>
        </div>
      </div>

      <div className={styles.panel}>
        <Card
          className={`${styles.card}${wide ? ` ${styles.cardWide}` : ""}`}
          bordered={false}
        >
          <Title level={3} className={styles.cardTitle}>
            {title}
          </Title>
          <Paragraph type="secondary" className={styles.cardSubtitle}>
            {subtitle}
          </Paragraph>
          {children}
          {footer}
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
