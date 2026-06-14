import type { KeyboardEvent } from "react";
import { Card, Tag, Typography, Button } from "antd";
import { ShoppingCartOutlined, EyeOutlined } from "@ant-design/icons";
import styles from "./ProductCard.module.css";

const { Meta } = Card;

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  originalPrice?: number;
  discountPercent?: number;
  className?: string;
  onView?: () => void;
  onAddToCart?: () => void;
}

const ProductCard = ({
  title,
  description,
  image,
  price,
  stock,
  originalPrice,
  discountPercent,
  className = "",
  onView,
  onAddToCart,
}: ProductCardProps) => {
  const inStock = stock > 0;
  const shortDescription =
    description.length > 72 ? `${description.slice(0, 72)}…` : description;

  const handleView = () => {
    onView?.();
  };

  const handleCoverKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleView();
    }
  };

  return (
    <Card
      className={`${styles.card} ${className}`.trim()}
      cover={
        <div
          className={styles.cover}
          role="button"
          tabIndex={0}
          aria-label={`Ver detalle de ${title}`}
          onClick={handleView}
          onKeyDown={handleCoverKeyDown}
        >
          <img src={image} alt={title} loading="lazy" draggable={false} />
          <Tag className={styles.stockTag} color={inStock ? "success" : "error"}>
            {inStock ? `${stock} en stock` : "Agotado"}
          </Tag>
          {discountPercent != null && (
            <Tag color="red" className={styles.discountTag}>
              -{discountPercent}%
            </Tag>
          )}
        </div>
      }
      actions={[
        <Button
          key="view"
          type="text"
          icon={<EyeOutlined />}
          className={styles.actionBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleView();
          }}
        >
          Ver
        </Button>,
        <Button
          key="cart"
          type="text"
          icon={<ShoppingCartOutlined />}
          className={styles.actionBtn}
          disabled={!inStock}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.();
          }}
        >
          Añadir
        </Button>,
      ]}
    >
      <Meta
        title={
          <Typography.Text strong className={styles.title}>
            {title}
          </Typography.Text>
        }
        description={
          <>
            <Typography.Paragraph
              type="secondary"
              className={styles.desc}
              ellipsis={{ rows: 2 }}
            >
              {shortDescription}
            </Typography.Paragraph>
            {originalPrice != null ? (
              <div className={styles.prices}>
                <Typography.Text delete type="secondary" className={styles.originalPrice}>
                  ${originalPrice.toFixed(2)}
                </Typography.Text>
                <Typography.Text strong className={styles.price}>
                  ${price.toFixed(2)}
                </Typography.Text>
              </div>
            ) : (
              <Typography.Text strong className={styles.price}>
                ${price.toFixed(2)}
              </Typography.Text>
            )}
          </>
        }
      />
    </Card>
  );
};

export default ProductCard;
