import { Router, type IRouter } from "express";
import { verifyTokenMiddleware } from "../../shared/lib/jwt.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import {
  handleDeleteUser,
  handleGetUserById,
  handleGetUsers,
  handleLogin,
  handleRegister,
  handleUpdateUser,
} from "./auth.controller.js";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
  userIdParamSchema,
} from "./auth.schemas.js";

const router: IRouter = Router();

router.post("/registro", validate(registerSchema), handleRegister);
router.post("/login", validate(loginSchema), handleLogin);
router.get("/usuarios/", verifyTokenMiddleware, handleGetUsers);
router.get(
  "/usuarios/:id",
  verifyTokenMiddleware,
  validate(userIdParamSchema, "params"),
  handleGetUserById,
);
router.put(
  "/usuarios/:id",
  verifyTokenMiddleware,
  validate(userIdParamSchema, "params"),
  validate(updateUserSchema),
  handleUpdateUser,
);
router.delete(
  "/usuarios/:id",
  verifyTokenMiddleware,
  validate(userIdParamSchema, "params"),
  handleDeleteUser,
);

export default router;
