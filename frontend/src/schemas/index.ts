import { z } from "zod";

export const userSchema = z.object({
  id_usuario: z.number(),
  nombre: z.string(),
  apellido: z.string().optional(),
  email: z.string().email(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  ciudad: z.string().optional(),
  rol: z.enum(["admin", "cliente"]),
  password: z.string().optional(),
});

export const loginResponseSchema = z.object({
  usuario: userSchema,
  token: z.string(),
});

export const registerSchema = z
  .object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    apellido: z.string().min(1, "El apellido es obligatorio"),
    email: z.string().email("Correo electrónico inválido"),
    direccion: z.string().min(1, "La dirección es obligatoria"),
    password: z.string().min(1, "La contraseña es obligatoria"),
    passwordconfirm: z.string().min(1, "Confirma tu contraseña"),
    telefono: z.string().min(1, "El teléfono es obligatorio"),
  })
  .refine((data) => data.password === data.passwordconfirm, {
    message: "Las contraseñas no coinciden",
    path: ["passwordconfirm"],
  });

export const productSchema = z.object({
  id_producto: z.number(),
  nombre_producto: z.string(),
  stock: z.number(),
  precio: z.number(),
  descripcion: z.string(),
});

export const categoriaSchema = z.object({
  id_categoria: z.number(),
  nombre_categoria: z.string(),
});

export const imagenSchema = z.object({
  id_imagen: z.number().optional(),
  id_producto: z.number(),
  url: z.string(),
});

export const orderDetailSchema = z.object({
  id_producto: z.number(),
  nombre_producto: z.string(),
  cantidad: z.number(),
  precio_unitario: z.number(),
  subtotal: z.number().optional(),
});

export const orderSchema = z.object({
  id_compra: z.number(),
  id_usuario: z.number(),
  fecha_compra: z.string(),
  detalle: z.array(orderDetailSchema),
  direccion: z.string(),
  precio_total: z.number(),
  estado: z.string(),
  nombre_cliente: z.string().optional(),
  email_cliente: z.string().optional(),
});

export const ordersResponseSchema = z.object({
  orders: z.array(orderSchema),
});

export const checkoutSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Correo electrónico inválido"),
  direccion: z.string().min(1, "La dirección es obligatoria"),
  ciudad: z.string().min(1, "La ciudad es obligatoria"),
});

export const createOrderSchema = z.object({
  id_usuario: z.number(),
  nombre_cliente: z.string(),
  email_cliente: z.string().email(),
  detalle: z.array(
    z.object({
      id_producto: z.number(),
      nombre_producto: z.string(),
      cantidad: z.number(),
      precio_unitario: z.number(),
    }),
  ),
  total: z.number(),
  estado: z.string(),
  direccion: z.string(),
});

export const createProductSchema = z.object({
  nombre_producto: z.string().min(1),
  stock: z.number().min(1),
  precio: z.number().min(0),
  descripcion: z.string().min(1),
  imagen: z.string().url("Ingresa una URL de imagen válida"),
});

export type User = z.infer<typeof userSchema>;
export type Product = z.infer<typeof productSchema>;
export type Categoria = z.infer<typeof categoriaSchema>;
export type Imagen = z.infer<typeof imagenSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderDetail = z.infer<typeof orderDetailSchema>;
export type CartItem = Product & { quantity: number };
