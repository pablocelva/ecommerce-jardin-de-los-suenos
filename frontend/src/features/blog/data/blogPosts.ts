import { HERO_SLIDES } from "@/shared/components/Carousel";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "plantas-ideales-principiantes",
    title: "5 plantas ideales para principiantes",
    excerpt:
      "Aprende cuáles son las más resistentes y fáciles de cuidar en casa.",
    image: HERO_SLIDES[0].imagen,
    date: "2026-05-10",
    author: "Equipo Jardin de los Sueños",
    readTime: "5 min",
    tags: ["Interior", "Consejos", "Principiantes"],
    content: [
      "Empezar en el mundo de las plantas puede ser abrumador, pero hay especies muy tolerantes que perdonan pequeños olvidos de riego y se adaptan bien a interiores con luz indirecta.",
      "La pothos, la sansevieria y el zamioculca son tres opciones casi infalibles: requieren poca agua, resisten ambientes con poca luz y crecen de forma constante sin exigir cuidados complejos.",
      "Colócalas en macetas con drenaje, usa sustrato universal y riega solo cuando la capa superior del suelo esté seca. Con estas bases, tu hogar estará verde en poco tiempo.",
    ],
  },
  {
    slug: "regar-correctamente-invierno",
    title: "Cómo regar correctamente en invierno",
    excerpt:
      "Evita el exceso de humedad y mantén tus plantas sanas en temporada fría.",
    image: HERO_SLIDES[1].imagen,
    date: "2026-04-22",
    author: "Equipo Jardin de los Sueños",
    readTime: "4 min",
    tags: ["Riego", "Invierno", "Cuidados"],
    content: [
      "En invierno las plantas reducen su metabolismo: necesitan menos agua y un ambiente más estable. Regar con la misma frecuencia que en verano es una de las causas más comunes de hongos y pudrición de raíces.",
      "Antes de regar, revisa el sustrato con el dedo a unos centímetros de profundidad. Si aún está húmedo, espera unos días más. Prefiere riegos profundos pero espaciados.",
      "Aleja las macetas de fuentes de calor directo y mantén humedad ambiental moderada. Un pulverizador ocasional ayuda a las especies tropicales sin saturar el suelo.",
    ],
  },
  {
    slug: "decorar-maceteros-naturales",
    title: "Decorar con maceteros naturales",
    excerpt:
      "Ideas para combinar texturas y colores en cada rincón de tu hogar.",
    image: HERO_SLIDES[2].imagen,
    date: "2026-03-15",
    author: "Equipo Jardin de los Sueños",
    readTime: "6 min",
    tags: ["Decoración", "Maceteros", "Estilo"],
    content: [
      "Los maceteros de terracota, cerámica artesanal y fibras naturales aportan calidez y conectan tus plantas con la estética del resto del hogar. Juega con alturas y tamaños para crear composiciones dinámicas.",
      "Combina tonos tierra con verdes intensos o elige macetas blancas y negras para un look minimalista. Agrupa plantas de distintas alturas en trípodes o repisas para dar profundidad visual.",
      "Recuerda que el macetero decorativo debe incluir buen drenaje. Usa maceta interior con agujeros o una capa de grava en la base para evitar acumulación de agua.",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
