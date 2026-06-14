import { Carousel } from "antd";

export interface BannerSlide {
  imagen: string;
  titulo: string;
  descripcion: string;
}

export const HERO_SLIDES: BannerSlide[] = [
  {
    imagen:
      "https://plus.unsplash.com/premium_photo-1663962158789-0ab624c4f17d?q=80&w=1200&auto=format&fit=crop",
    titulo: "Bienvenido a Jardin de los Sueños",
    descripcion: "Plantas, flores y decoración natural para tu hogar",
  },
  {
    imagen:
      "https://plus.unsplash.com/premium_photo-1678382341022-0d8a8765f141?q=80&w=1200&auto=format&fit=crop",
    titulo: "Llena tu espacio de vida",
    descripcion: "Descubre nuestra colección de plantas de interior y exterior",
  },
  {
    imagen:
      "https://images.unsplash.com/photo-1463554050456-f2ed7d3fec09?q=80&w=1200&auto=format&fit=crop",
    titulo: "Decoración viva",
    descripcion: "Crea ambientes naturales con nuestras plantas seleccionadas",
  },
];

interface BannerCarouselProps {
  slides?: BannerSlide[];
}

const BannerCarousel = ({ slides = HERO_SLIDES }: BannerCarouselProps) => {
  return (
    <Carousel autoplay effect="fade">
      {slides.map((item, index) => (
        <div key={index} className="banner-slide">
          <img src={item.imagen} alt={item.titulo} className="banner-img" />
          <div className="banner-text">
            <h2>{item.titulo}</h2>
            <p>{item.descripcion}</p>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default BannerCarousel;
