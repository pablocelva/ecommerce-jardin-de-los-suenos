import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const productos = pgTable("productos", {
  id_producto: serial("id_producto").primaryKey(),
  nombre_producto: varchar("nombre_producto", { length: 255 }).notNull().unique(),
  descripcion: text("descripcion"),
  precio: numeric("precio", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull(),
  fecha_creacion: timestamp("fecha_creacion").defaultNow(),
});

export const categorias = pgTable("categorias", {
  id_categoria: serial("id_categoria").primaryKey(),
  nombre_categoria: varchar("nombre_categoria", { length: 255 }).notNull().unique(),
});

export const categoriasProductos = pgTable(
  "categorias_productos",
  {
    id_producto: integer("id_producto")
      .notNull()
      .references(() => productos.id_producto, { onDelete: "cascade" }),
    id_categoria: integer("id_categoria")
      .notNull()
      .references(() => categorias.id_categoria, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.id_producto, table.id_categoria] })],
);

export const imagenesProducto = pgTable("imagenes_producto", {
  id_imagen: serial("id_imagen").primaryKey(),
  id_producto: integer("id_producto")
    .notNull()
    .references(() => productos.id_producto, { onDelete: "cascade" }),
  url: text("url").notNull(),
});

export type Producto = typeof productos.$inferSelect;
export type Categoria = typeof categorias.$inferSelect;
export type ImagenProducto = typeof imagenesProducto.$inferSelect;
