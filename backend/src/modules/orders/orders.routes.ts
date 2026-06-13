import { Router, type IRouter } from "express";
import { verifyTokenMiddleware } from "../../shared/lib/jwt.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import {
  handleCreateOrder,
  handleDeleteOrder,
  handleGetAllOrders,
  handleGetOrderByOrderId,
  handleGetOrdersByUserId,
  handleUpdateOrderStatus,
} from "./orders.controller.js";
import {
  createOrderSchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
  userOrdersParamSchema,
} from "./orders.schemas.js";

const router: IRouter = Router();

router.get("/", verifyTokenMiddleware, handleGetAllOrders);
router.get(
  "/pedido/:id_compra",
  verifyTokenMiddleware,
  validate(orderIdParamSchema, "params"),
  handleGetOrderByOrderId,
);
router.get(
  "/usuario/:id_usuario",
  verifyTokenMiddleware,
  validate(userOrdersParamSchema, "params"),
  handleGetOrdersByUserId,
);
router.post("/", validate(createOrderSchema), handleCreateOrder);
router.put(
  "/pedido/:id_compra",
  verifyTokenMiddleware,
  validate(orderIdParamSchema, "params"),
  validate(updateOrderStatusSchema),
  handleUpdateOrderStatus,
);
router.delete(
  "/pedido/:id_compra",
  verifyTokenMiddleware,
  validate(orderIdParamSchema, "params"),
  handleDeleteOrder,
);

export default router;
