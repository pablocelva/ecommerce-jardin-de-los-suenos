import {
  pgTable,
  serial,
  integer,
  numeric,
  text,
  varchar,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { usuarios } from "./users.schema.js";

export type OrderDetailRow = {
  id_producto: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number | undefined;
};

export const orders = pgTable("orders", {
  id_compra: serial("id_compra").primaryKey(),
  id_usuario: integer("id_usuario").references(() => usuarios.id_usuario, {
    onDelete: "set null",
  }),
  precio_total: numeric("precio_total", { precision: 10, scale: 2 }).notNull(),
  detalle: jsonb("detalle").$type<OrderDetailRow[]>().notNull(),
  direccion: text("direccion").notNull(),
  estado: varchar("estado", { length: 50 }).default("pending"),
  fecha_compra: timestamp("fecha_compra").defaultNow(),
  fecha_envio: timestamp("fecha_envio"),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
