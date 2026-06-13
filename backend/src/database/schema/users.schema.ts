import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const usuarios = pgTable("usuarios", {
  id_usuario: serial("id_usuario").primaryKey(),
  email: varchar("email", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  nombre: varchar("nombre", { length: 100 }),
  apellido: varchar("apellido", { length: 100 }),
  direccion: text("direccion"),
  telefono: varchar("telefono", { length: 30 }),
  rol: varchar("rol", { length: 20 }).default("cliente"),
  imagen_perfil: text("imagen_perfil"),
  fecha_creacion: timestamp("fecha_creacion").defaultNow(),
});

export type Usuario = typeof usuarios.$inferSelect;
export type NewUsuario = typeof usuarios.$inferInsert;
