import { Router, type IRouter } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import productsRoutes from "../modules/products/products.routes.js";
import ordersRoutes from "../modules/orders/orders.routes.js";

const router: IRouter = Router();

router.use("/auth", authRoutes);
router.use("/productos", productsRoutes);
router.use("/pedidos", ordersRoutes);

export default router;
