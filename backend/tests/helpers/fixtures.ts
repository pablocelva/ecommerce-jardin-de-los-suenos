import type { Usuario } from "../../src/database/schema/users.schema.js";
import type { Producto } from "../../src/database/schema/products.schema.js";
import type { Order } from "../../src/database/schema/orders.schema.js";

export const mockUsuario: Usuario = {
  id_usuario: 1,
  email: "test@example.com",
  password: "hashedPassword",
  nombre: "Test",
  apellido: "User",
  direccion: "Calle 1",
  telefono: "123456789",
  rol: "cliente",
  imagen_perfil: null,
  fecha_creacion: new Date("2025-01-28T12:00:00"),
};

export const mockProducto: Producto = {
  id_producto: 1,
  nombre_producto: "Monstera Deliciosa",
  descripcion: "Planta de interior",
  precio: "25.99",
  stock: 10,
  fecha_creacion: new Date("2025-01-28T12:00:00"),
};

export const mockOrder: Order = {
  id_compra: 1,
  id_usuario: 2,
  precio_total: "64.97",
  detalle: [
    {
      id_producto: 1,
      nombre_producto: "Monstera Deliciosa",
      cantidad: 2,
      precio_unitario: 25.99,
      subtotal: 51.98,
    },
  ],
  direccion: "Calle Falsa 123",
  estado: "pending",
  fecha_compra: new Date("2025-01-28T14:00:00"),
  fecha_envio: null,
};

export const validRegisterBody = {
  email: "nuevo@example.com",
  password: "password123",
  nombre: "Nuevo",
  apellido: "Usuario",
  direccion: "Av. Principal 100",
  telefono: "+56911111111",
};

export const validProductBody = {
  nombre_producto: "Suculenta",
  descripcion: "Planta de bajo mantenimiento",
  precio: 12.99,
  stock: 20,
};

export const validOrderBody = {
  id_usuario: 2,
  nombre_cliente: "Juan Pérez",
  email_cliente: "juan@example.com",
  detalle: [
    {
      id_producto: 1,
      nombre_producto: "Monstera Deliciosa",
      cantidad: 1,
      precio_unitario: 25.99,
      subtotal: 25.99,
    },
  ],
  total: 25.99,
  estado: "pending" as const,
  direccion: "Calle Falsa 123",
};
