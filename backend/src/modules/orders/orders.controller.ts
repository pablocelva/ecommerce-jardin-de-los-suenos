import type { Request, Response, NextFunction } from "express";
import { ordersService } from "./orders.service.js";

export async function handleGetAllOrders(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orders = await ordersService.getAllOrders();
    res.status(200).json({
      message: `Total de ordenes de compra: ${orders.length}`,
      orders,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetOrdersByUserId(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id_usuario = req.params.id_usuario as unknown as number;
    const orders = await ordersService.getOrdersByUserId(id_usuario);
    res.status(200).json({
      message: `Ordenes de compra del ususario con id ${id_usuario}, total de ordenes: ${orders.length}`,
      orders,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleGetOrderByOrderId(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id_compra = req.params.id_compra as unknown as number;
    const order = await ordersService.getOrderById(id_compra);
    res.status(200).json({
      message: `Detalle de la orden de compra con id ${id_compra}`,
      order,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleCreateOrder(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const order = await ordersService.createOrder(req.body);
    res.status(201).json({
      message: "Pedido creado exitosamente",
      order,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id_compra = req.params.id_compra as unknown as number;
    const order = await ordersService.updateOrderStatus(
      id_compra,
      req.body.estado,
    );
    res.status(200).json({
      message: `Estado de la orden de compra con id ${id_compra} actualizado a ${req.body.estado} exitosamente`,
      order,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteOrder(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id_compra = req.params.id_compra as unknown as number;
    const order = await ordersService.deleteOrder(id_compra);
    res.status(200).json({
      message: "Orden de compra eliminada exitosamente",
      order,
    });
  } catch (error) {
    next(error);
  }
}
