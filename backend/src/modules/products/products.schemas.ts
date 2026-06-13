import { z } from "zod";

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createProductSchema = z.object({
  nombre_producto: z.string().min(1),
  descripcion: z.string().min(1),
  precio: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
});

export const updateProductSchema = createProductSchema;

export const addImagenSchema = z.object({
  id_producto: z.coerce.number().int().positive(),
  url: z.string().url(),
});

export const productCategoriaSchema = z.object({
  id_producto: z.coerce.number().int().positive(),
  id_categoria: z.coerce.number().int().positive(),
});

export const productDtoSchema = z.object({
  id_producto: z.number(),
  nombre_producto: z.string(),
  descripcion: z.string().nullable(),
  precio: z.number(),
  stock: z.number(),
  fecha_creacion: z.date().nullable().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductDto = z.infer<typeof productDtoSchema>;
