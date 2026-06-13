import { eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { usuarios, type Usuario } from "../../database/schema/users.schema.js";

export class AuthRepository {
  async findByEmail(email: string): Promise<Usuario | undefined> {
    const [user] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);
    return user;
  }

  async findById(id: number): Promise<Usuario | undefined> {
    const [user] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id_usuario, id))
      .limit(1);
    return user;
  }

  async findByIdentifier(identifier: string | number): Promise<Usuario | undefined> {
    if (typeof identifier === "number" || !Number.isNaN(Number(identifier))) {
      return this.findById(Number(identifier));
    }
    return this.findByEmail(String(identifier));
  }

  async findAll(): Promise<Usuario[]> {
    return db.select().from(usuarios);
  }

  async create(data: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
  }): Promise<Usuario> {
    const [user] = await db
      .insert(usuarios)
      .values({
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido,
        direccion: data.direccion,
        telefono: data.telefono,
      })
      .returning();
    if (!user) {
      throw new Error("Error al crear usuario");
    }
    return user;
  }

  async update(
    id: number,
    data: {
      email: string;
      password: string;
      nombre: string;
      apellido: string;
      direccion: string;
      telefono: string;
    },
  ): Promise<Usuario | undefined> {
    const [user] = await db
      .update(usuarios)
      .set({
        email: data.email,
        password: data.password,
        nombre: data.nombre,
        apellido: data.apellido,
        direccion: data.direccion,
        telefono: data.telefono,
      })
      .where(eq(usuarios.id_usuario, id))
      .returning();
    return user;
  }

  async delete(id: number): Promise<Usuario | undefined> {
    const [user] = await db
      .delete(usuarios)
      .where(eq(usuarios.id_usuario, id))
      .returning();
    return user;
  }
}

export const authRepository = new AuthRepository();
