import type { Request, Response, NextFunction } from "express";
import { productsService } from "./products.service.js";

export async function handleGetAllProducts(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const products = await productsService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

export async function handleGetProductById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await productsService.getProductById(
      req.params.id as unknown as number,
    );
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export async function handleCreateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const product = await productsService.updateProduct(
      req.params.id as unknown as number,
      req.body,
    );
    res.status(200).json({
      message: "Producto actualizado correctamente",
      product,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await productsService.deleteProduct(req.params.id as unknown as number);
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    next(error);
  }
}

export async function handleGetImagenes(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const imagenes = await productsService.getAllImagenes();
    res.status(200).json(imagenes);
  } catch (error) {
    next(error);
  }
}

export async function handleGetImagenesByIdProducto(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const imagenes = await productsService.getImagenesByProductId(
      req.params.id as unknown as number,
    );
    res.status(200).json(imagenes);
  } catch (error) {
    next(error);
  }
}

export async function handleAddImagenProducto(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const imagenes = await productsService.addImagen(
      req.body.id_producto,
      req.body.url,
    );
    res.status(200).json(imagenes);
  } catch (error) {
    next(error);
  }
}

export async function handleGetAllCategorias(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categorias = await productsService.getAllCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
}

export async function handleGetProductsByCategoria(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const productos = await productsService.getProductsByCategoria(
      req.params.id as unknown as number,
    );
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
}

export async function handleGetCategoriasByIdProducto(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categorias = await productsService.getCategoriasByProductId(
      req.params.id as unknown as number,
    );
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
}

export async function handleAddProductCategoria(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categorias = await productsService.addProductCategoria(
      req.body.id_producto,
      req.body.id_categoria,
    );
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateProductCategoria(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categorias = await productsService.updateProductCategoria(
      req.body.id_producto,
      req.body.id_categoria,
    );
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteProductCategoria(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const categorias = await productsService.deleteProductCategoria(
      req.body.id_producto,
      req.body.id_categoria,
    );
    res.status(200).json(categorias);
  } catch (error) {
    next(error);
  }
}
