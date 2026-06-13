import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(1, "password inválido"),
});

export const registerSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(1, "Password inválido"),
  nombre: z.string().min(1, "Nombre inválido"),
  apellido: z.string().min(1, "Apellido inválido"),
  direccion: z.string().min(1, "Dirección inválida"),
  telefono: z.string().min(1, "Teléfono inválido"),
});

export const updateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  nombre: z.string().min(1),
  apellido: z.string().min(1),
  direccion: z.string().min(1),
  telefono: z.string().min(1),
});

export const userIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const userPublicSchema = z.object({
  id_usuario: z.number(),
  email: z.string(),
  nombre: z.string().nullable(),
  apellido: z.string().nullable(),
  direccion: z.string().nullable(),
  telefono: z.string().nullable(),
  rol: z.string(),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  usuario: userPublicSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserPublicDto = z.infer<typeof userPublicSchema>;
