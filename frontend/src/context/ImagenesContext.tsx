import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import productosJSON from "../data/productos.json";
import { apiURL } from "../lib/api";
import { imagenSchema, type Imagen } from "../schemas";

interface ImagenesContextValue {
  imagenes: Imagen[];
  setImagenes: React.Dispatch<React.SetStateAction<Imagen[]>>;
}

const ImagenesContext = createContext<ImagenesContextValue | null>(null);

export const useImagenes = () => {
  const context = useContext(ImagenesContext);
  if (!context) {
    throw new Error("useImagenes debe usarse dentro de ImagenesProvider");
  }
  return context;
};

export const ImagenesProvider = ({ children }: { children: ReactNode }) => {
  const [imagenes, setImagenes] = useState<Imagen[]>([]);

  useEffect(() => {
    fetch(`${apiURL}/productos/imagenes`)
      .then((res) => res.json())
      .then((data) => setImagenes(imagenSchema.array().parse(data)))
      .catch((error) => {
        console.error("Error obteniendo imágenes, usando datos locales:", error);
        setImagenes(
          productosJSON.map((producto) => {
            const url = producto.imagen_producto;
            return {
              id_producto: producto.id_producto,
              url: Array.isArray(url) ? url[0] : url,
            };
          }),
        );
      });
  }, []);

  return (
    <ImagenesContext.Provider value={{ imagenes, setImagenes }}>
      {children}
    </ImagenesContext.Provider>
  );
};

export default ImagenesContext;
