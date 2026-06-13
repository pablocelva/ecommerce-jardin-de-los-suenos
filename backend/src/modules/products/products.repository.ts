import { and, eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import {
  productos,
  categorias,
  categoriasProductos,
  imagenesProducto,
  type Producto,
  type Categoria,
  type ImagenProducto,
} from "../../database/schema/products.schema.js";

export class ProductsRepository {
  async findAll(): Promise<Producto[]> {
    return db.select().from(productos);
  }

  async findById(id: number): Promise<Producto | undefined> {
    const [product] = await db
      .select()
      .from(productos)
      .where(eq(productos.id_producto, id))
      .limit(1);
    return product;
  }

  async create(data: {
    nombre_producto: string;
    descripcion: string;
    precio: string;
    stock: number;
  }): Promise<Producto> {
    const [product] = await db
      .insert(productos)
      .values(data)
      .returning();
    if (!product) throw new Error("Error al crear producto");
    return product;
  }

  async update(
    id: number,
    data: {
      nombre_producto: string;
      descripcion: string;
      precio: string;
      stock: number;
    },
  ): Promise<Producto | undefined> {
    const [product] = await db
      .update(productos)
      .set(data)
      .where(eq(productos.id_producto, id))
      .returning();
    return product;
  }

  async delete(id: number): Promise<{ id_producto: number } | undefined> {
    const [product] = await db
      .delete(productos)
      .where(eq(productos.id_producto, id))
      .returning({ id_producto: productos.id_producto });
    return product;
  }

  async findAllImagenes(): Promise<ImagenProducto[]> {
    return db.select().from(imagenesProducto);
  }

  async findImagenesByProductId(id: number): Promise<ImagenProducto[]> {
    return db
      .select()
      .from(imagenesProducto)
      .where(eq(imagenesProducto.id_producto, id));
  }

  async addImagen(id_producto: number, url: string): Promise<ImagenProducto[]> {
    await db.insert(imagenesProducto).values({ id_producto, url });
    return this.findImagenesByProductId(id_producto);
  }

  async findAllCategorias(): Promise<Categoria[]> {
    return db.select().from(categorias);
  }

  async findByCategoria(id_categoria: number): Promise<Producto[]> {
    return db
      .select({
        id_producto: productos.id_producto,
        nombre_producto: productos.nombre_producto,
        descripcion: productos.descripcion,
        precio: productos.precio,
        stock: productos.stock,
        fecha_creacion: productos.fecha_creacion,
      })
      .from(productos)
      .innerJoin(
        categoriasProductos,
        eq(productos.id_producto, categoriasProductos.id_producto),
      )
      .where(eq(categoriasProductos.id_categoria, id_categoria));
  }

  async findCategoriasByProductId(id_producto: number) {
    return db
      .select()
      .from(categoriasProductos)
      .where(eq(categoriasProductos.id_producto, id_producto));
  }

  async addProductCategoria(id_producto: number, id_categoria: number) {
    await db
      .insert(categoriasProductos)
      .values({ id_producto, id_categoria });
    return this.findCategoriasByProductId(id_producto);
  }

  async updateProductCategoria(id_producto: number, id_categoria: number) {
    await db
      .update(categoriasProductos)
      .set({ id_categoria })
      .where(eq(categoriasProductos.id_producto, id_producto));
    return this.findCategoriasByProductId(id_producto);
  }

  async deleteProductCategoria(id_producto: number, id_categoria: number) {
    await db
      .delete(categoriasProductos)
      .where(
        and(
          eq(categoriasProductos.id_producto, id_producto),
          eq(categoriasProductos.id_categoria, id_categoria),
        ),
      );
    return this.findCategoriasByProductId(id_producto);
  }
}

export const productsRepository = new ProductsRepository();
