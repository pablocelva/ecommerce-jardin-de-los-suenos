import { useRef, type ReactNode } from "react";
import { Button, Carousel } from "antd";
import type { CarouselProps, CarouselRef } from "antd/es/carousel";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface CardCarouselProps extends CarouselProps {
  className?: string;
  autoplayInterval?: number;
  children: ReactNode;
}

const CardCarousel = ({
  className = "",
  autoplayInterval = 5000,
  children,
  dots = true,
  ...carouselProps
}: CardCarouselProps) => {
  const carouselRef = useRef<CarouselRef>(null);

  return (
    <div className={`card-carousel-wrapper ${className}`.trim()}>
      <Button
        type="default"
        shape="circle"
        size="large"
        icon={<LeftOutlined />}
        className="card-carousel-nav card-carousel-nav-prev"
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
        className={`card-carousel ${className}`.trim()}
      >
        {children}
      </Carousel>
      <Button
        type="default"
        shape="circle"
        size="large"
        icon={<RightOutlined />}
        className="card-carousel-nav card-carousel-nav-next"
        aria-label="Siguiente"
        onClick={() => carouselRef.current?.next()}
      />
    </div>
  );
};

export default CardCarousel;
