import type { ReactNode } from "react";
import { Card, Typography } from "antd";
import { BranchesOutlined } from "@ant-design/icons";

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
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <BranchesOutlined className="auth-hero-icon" />
          <Title level={2} className="auth-hero-title">
            Jardin de los Sueños
          </Title>
          <Paragraph className="auth-hero-text">
            Tu tienda de confianza para plantas de interior, exterior y
            decoración natural.
          </Paragraph>
        </div>
      </div>

      <div className="auth-panel">
        <Card
          className={`auth-card${wide ? " auth-card-wide" : ""}`}
          bordered={false}
        >
          <Title level={3} className="auth-card-title">
            {title}
          </Title>
          <Paragraph type="secondary" className="auth-card-subtitle">
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
