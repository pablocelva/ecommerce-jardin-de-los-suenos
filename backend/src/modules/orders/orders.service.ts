import type { Order } from "../../database/schema/orders.schema.js";
import { createAppError } from "../../shared/errors/AppError.js";
import { ordersRepository } from "./orders.repository.js";
import type { CreateOrderInput, OrderDto } from "./orders.schemas.js";

function toOrderDto(order: Order): OrderDto {
  return {
    id_compra: order.id_compra,
    id_usuario: order.id_usuario,
    precio_total: Number(order.precio_total),
    detalle: order.detalle,
    direccion: order.direccion,
    estado: order.estado,
    ...(order.fecha_compra !== null && { fecha_compra: order.fecha_compra }),
    ...(order.fecha_envio !== null && { fecha_envio: order.fecha_envio }),
  };
}

export class OrdersService {
  async getAllOrders(): Promise<OrderDto[]> {
    const ordersList = await ordersRepository.findAll();
    return ordersList.map(toOrderDto);
  }

  async getOrdersByUserId(id_usuario: number): Promise<OrderDto[]> {
    const ordersList = await ordersRepository.findByUserId(id_usuario);
    return ordersList.map(toOrderDto);
  }

  async getOrderById(id_compra: number): Promise<OrderDto> {
    const order = await ordersRepository.findById(id_compra);
    if (!order) {
      throw createAppError("ORDER_NOT_FOUND");
    }
    return toOrderDto(order);
  }

  async createOrder(input: CreateOrderInput): Promise<OrderDto> {
    const order = await ordersRepository.create({
      id_usuario: input.id_usuario,
      precio_total: String(input.total),
      detalle: input.detalle,
      direccion: input.direccion,
      estado: input.estado,
    });
    return toOrderDto(order);
  }

  async updateOrderStatus(
    id_compra: number,
    estado: string,
  ): Promise<OrderDto> {
    const order = await ordersRepository.updateStatus(id_compra, estado);
    if (!order) {
      throw createAppError("ORDER_NOT_FOUND");
    }
    return toOrderDto(order);
  }

  async deleteOrder(id_compra: number): Promise<OrderDto> {
    const order = await ordersRepository.delete(id_compra);
    if (!order) {
      throw new Error("No se encontró la orden");
    }
    return toOrderDto(order);
  }
}

export const ordersService = new OrdersService();
