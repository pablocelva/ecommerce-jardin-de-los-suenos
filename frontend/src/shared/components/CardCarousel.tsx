import { useRef, type ReactNode } from "react";
import { Button, Carousel } from "antd";
import type { CarouselProps, CarouselRef } from "antd/es/carousel";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from "./CardCarousel.module.css";

interface CardCarouselProps extends CarouselProps {
  className?: string;
  autoplayInterval?: number;
  children: ReactNode;
}

export const CARD_CAROUSEL_SLIDE_CLASS = styles.slide;

const CardCarousel = ({
  className = "",
  autoplayInterval = 5000,
  children,
  dots = true,
  ...carouselProps
}: CardCarouselProps) => {
  const carouselRef = useRef<CarouselRef>(null);

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      <Button
        type="default"
        shape="circle"
        size="large"
        icon={<LeftOutlined />}
        className={`${styles.nav} ${styles.navPrev}`}
        aria-label="Anterior"
        onClick={() => carouselRef.current?.prev()}
      />
      <Carousel
        ref={carouselRef}
        autoplay
        autoplaySpeed={autoplayInterval}
        dots={dots}
        pauseOnHover
        {...carouselProps}
        className={`${styles.carousel} ${className}`.trim()}
      >
        {children}
      </Carousel>
      <Button
        type="default"
        shape="circle"
        size="large"
        icon={<RightOutlined />}
        className={`${styles.nav} ${styles.navNext}`}
        aria-label="Siguiente"
        onClick={() => carouselRef.current?.next()}
      />
    </div>
  );
};

export default CardCarousel;
