import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { api } from "../lib/api";
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
    api
      .get<unknown>("/productos/imagenes")
      .then((data) => setImagenes(imagenSchema.array().parse(data)))
      .catch((error) => {
        console.error("Error obteniendo imágenes:", error);
        setImagenes([]);
      });
  }, []);

  return (
    <ImagenesContext.Provider value={{ imagenes, setImagenes }}>
      {children}
    </ImagenesContext.Provider>
  );
};

export default ImagenesContext;
