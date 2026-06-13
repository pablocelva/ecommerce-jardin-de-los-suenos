import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { api } from "../lib/api";
import {
  categoriaSchema,
  productSchema,
  type Categoria,
  type Product,
} from "../schemas";

interface ProductContextValue {
  productos: Product[];
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
}

export const ProductContext = createContext<ProductContextValue>({
  productos: [],
  categorias: [],
  loading: true,
  error: null,
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productosData, categoriasData] = await Promise.all([
          api.get<unknown>("/productos/"),
          api.get<unknown>("/productos/categorias"),
        ]);

        setProductos(productSchema.array().parse(productosData));
        setCategorias(categoriaSchema.array().parse(categoriasData));
      } catch (err) {
        console.error("Error al obtener productos/categorías:", err);
        setError("No se pudieron cargar los productos del servidor.");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return (
    <ProductContext.Provider value={{ productos, categorias, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
