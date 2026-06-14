import { api } from "@/shared/lib/api";
import {
  categoriaSchema,
  imagenSchema,
  productSchema,
  type Categoria,
  type Imagen,
  type Product,
} from "@/shared/schemas";

export async function fetchProducts(): Promise<Product[]> {
  const data = await api.get<unknown>("/productos/");
  return productSchema.array().parse(data);
}

export async function fetchCategories(): Promise<Categoria[]> {
  const data = await api.get<unknown>("/productos/categorias");
  return categoriaSchema.array().parse(data);
}

export async function fetchImages(): Promise<Imagen[]> {
  const data = await api.get<unknown>("/productos/imagenes");
  return imagenSchema.array().parse(data);
}

export async function fetchProductsByCategory(
  categoryId: number,
): Promise<Product[]> {
  const data = await api.get<unknown>(`/productos/categorias/${categoryId}`);
  return productSchema.array().parse(data);
}
