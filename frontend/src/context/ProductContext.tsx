import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { apiURL } from "../lib/api";
import {
  categoriaSchema,
  productSchema,
  type Categoria,
  type Product,
} from "../schemas";

interface ProductContextValue {
  productos: Product[];
  categorias: Categoria[];
}

export const ProductContext = createContext<ProductContextValue>({
  productos: [],
  categorias: [],
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProductos = await fetch(`${apiURL}/productos`);
        if (!resProductos.ok) throw new Error("Error al cargar los productos");

        const productosData = await resProductos.json();
        const parsedProductos = productSchema.array().parse(productosData);

        const resCategorias = await fetch(`${apiURL}/productos/categorias`);
        if (!resCategorias.ok) throw new Error("Error al cargar las categorías");

        const categoriasData = await resCategorias.json();
        const parsedCategorias = categoriaSchema.array().parse(categoriasData);

        setProductos(parsedProductos);
        setCategorias(parsedCategorias);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ProductContext.Provider value={{ productos, categorias }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
