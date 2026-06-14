import { useQuery } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchImages,
  fetchProducts,
  fetchProductsByCategory,
} from "./catalog.api";

export const catalogKeys = {
  all: ["catalog"] as const,
  products: () => [...catalogKeys.all, "products"] as const,
  categories: () => [...catalogKeys.all, "categories"] as const,
  images: () => [...catalogKeys.all, "images"] as const,
  categoryProducts: (categoryId: number) =>
    [...catalogKeys.all, "category-products", categoryId] as const,
};

export function useProductsQuery() {
  return useQuery({
    queryKey: catalogKeys.products(),
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: catalogKeys.categories(),
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });
}

export function useImagesQuery() {
  return useQuery({
    queryKey: catalogKeys.images(),
    queryFn: fetchImages,
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategoryProductsQuery(categoryId: number | undefined) {
  return useQuery({
    queryKey: catalogKeys.categoryProducts(categoryId ?? 0),
    queryFn: () => fetchProductsByCategory(categoryId!),
    enabled: categoryId != null && categoryId > 0,
    staleTime: 1000 * 60 * 5,
  });
}

/** Datos de catálogo unificados (reemplaza ProductContext + ImagenesContext). */
export function useCatalog() {
  const productsQuery = useProductsQuery();
  const categoriesQuery = useCategoriesQuery();
  const imagesQuery = useImagesQuery();

  const loading =
    productsQuery.isLoading ||
    categoriesQuery.isLoading ||
    imagesQuery.isLoading;

  const error =
    productsQuery.error?.message ??
    categoriesQuery.error?.message ??
    imagesQuery.error?.message ??
    null;

  return {
    productos: productsQuery.data ?? [],
    categorias: categoriesQuery.data ?? [],
    imagenes: imagesQuery.data ?? [],
    loading,
    error,
    refetchProducts: productsQuery.refetch,
  };
}
