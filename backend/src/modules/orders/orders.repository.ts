import { desc, eq } from "drizzle-orm";
import { db } from "../../config/database.js";
import { orders, type Order } from "../../database/schema/orders.schema.js";

export class OrdersRepository {
  async findAll(): Promise<Order[]> {
    return db.select().from(orders);
  }

  async findByUserId(id_usuario: number): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .where(eq(orders.id_usuario, id_usuario))
      .orderBy(desc(orders.fecha_compra));
  }

  async findById(id_compra: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id_compra, id_compra))
      .limit(1);
    return order;
  }

  async create(data: {
    id_usuario: number;
    precio_total: string;
    detalle: Order["detalle"];
    direccion: string;
    estado: string;
  }): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values({
        id_usuario: data.id_usuario,
        precio_total: data.precio_total,
        detalle: data.detalle,
        direccion: data.direccion,
        estado: data.estado,
      })
      .returning();
    if (!order) throw new Error("Error al crear el pedido en la base de datos");
    return order;
  }

  async updateStatus(
    id_compra: number,
    estado: string,
  ): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({
        estado,
        ...(estado === "shipped" && { fecha_envio: new Date() }),
      })
      .where(eq(orders.id_compra, id_compra))
      .returning();
    return order;
  }

  async delete(id_compra: number): Promise<Order | undefined> {
    const [order] = await db
      .delete(orders)
      .where(eq(orders.id_compra, id_compra))
      .returning();
    return order;
  }
}

export const ordersRepository = new OrdersRepository();
