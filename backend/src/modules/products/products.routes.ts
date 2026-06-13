import { Router, type IRouter } from "express";
import { verifyTokenMiddleware } from "../../shared/lib/jwt.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import {
  handleAddImagenProducto,
  handleAddProductCategoria,
  handleCreateProduct,
  handleDeleteProduct,
  handleDeleteProductCategoria,
  handleGetAllCategorias,
  handleGetAllProducts,
  handleGetCategoriasByIdProducto,
  handleGetImagenes,
  handleGetImagenesByIdProducto,
  handleGetProductById,
  handleGetProductsByCategoria,
  handleUpdateProduct,
  handleUpdateProductCategoria,
} from "./products.controller.js";
import {
  addImagenSchema,
  createProductSchema,
  productCategoriaSchema,
  productIdParamSchema,
} from "./products.schemas.js";

const router: IRouter = Router();

router.get("/", handleGetAllProducts);
router.get("/imagenes", handleGetImagenes);
router.get("/categorias", handleGetAllCategorias);
router.get(
  "/categorias/:id",
  validate(productIdParamSchema, "params"),
  handleGetProductsByCategoria,
);
router.get(
  "/:id/imagenes",
  validate(productIdParamSchema, "params"),
  handleGetImagenesByIdProducto,
);
router.get(
  "/:id/categorias",
  validate(productIdParamSchema, "params"),
  handleGetCategoriasByIdProducto,
);
router.get(
  "/:id",
  validate(productIdParamSchema, "params"),
  handleGetProductById,
);

router.post("/", verifyTokenMiddleware, validate(createProductSchema), handleCreateProduct);
router.put(
  "/:id",
  verifyTokenMiddleware,
  validate(productIdParamSchema, "params"),
  validate(createProductSchema),
  handleUpdateProduct,
);
router.delete(
  "/:id",
  verifyTokenMiddleware,
  validate(productIdParamSchema, "params"),
  handleDeleteProduct,
);

router.post(
  "/imagenes",
  verifyTokenMiddleware,
  validate(addImagenSchema),
  handleAddImagenProducto,
);

router.post(
  "/:id/categorias",
  verifyTokenMiddleware,
  validate(productCategoriaSchema),
  handleAddProductCategoria,
);
router.put(
  "/:id/categorias",
  verifyTokenMiddleware,
  validate(productCategoriaSchema),
  handleUpdateProductCategoria,
);
router.delete(
  "/:id/categorias",
  verifyTokenMiddleware,
  validate(productCategoriaSchema),
  handleDeleteProductCategoria,
);

export default router;
