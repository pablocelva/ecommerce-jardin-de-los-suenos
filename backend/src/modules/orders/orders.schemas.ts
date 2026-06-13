import { z } from "zod";

export const orderDetailSchema = z.object({
  id_producto: z.number(),
  nombre_producto: z.string(),
  cantidad: z.number(),
  precio_unitario: z.number(),
  subtotal: z.number().optional(),
});

export const createOrderSchema = z.object({
  id_usuario: z.number(),
  nombre_cliente: z.string().min(1),
  email_cliente: z.string().email(),
  detalle: z.array(orderDetailSchema).min(1),
  total: z.number().nonnegative(),
  fecha_orden: z.string().optional(),
  estado: z
    .enum(["pending", "shipped", "delivered", "cancelled"])
    .default("pending"),
  direccion: z.string().min(1),
});

export const updateOrderStatusSchema = z.object({
  estado: z.enum(["pending", "shipped", "delivered", "cancelled"]),
});

export const orderIdParamSchema = z.object({
  id_compra: z.coerce.number().int().positive(),
});

export const userOrdersParamSchema = z.object({
  id_usuario: z.coerce.number().int().positive(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const orderDtoSchema = z.object({
  id_compra: z.number(),
  id_usuario: z.number().nullable(),
  precio_total: z.number(),
  detalle: z.array(orderDetailSchema),
  direccion: z.string(),
  estado: z.string().nullable(),
  fecha_compra: z.date().nullable().optional(),
  fecha_envio: z.date().nullable().optional(),
});

export type OrderDto = z.infer<typeof orderDtoSchema>;
