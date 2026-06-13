import type { Producto } from "../../database/schema/products.schema.js";
import { createAppError } from "../../shared/errors/AppError.js";
import { productsRepository } from "./products.repository.js";
import type { CreateProductInput, ProductDto } from "./products.schemas.js";

function toProductDto(product: Producto): ProductDto {
  return {
    id_producto: product.id_producto,
    nombre_producto: product.nombre_producto,
    descripcion: product.descripcion,
    precio: Number(product.precio),
    stock: product.stock,
    ...(product.fecha_creacion !== null && {
      fecha_creacion: product.fecha_creacion,
    }),
  };
}

export class ProductsService {
  async getAllProducts(): Promise<ProductDto[]> {
    const products = await productsRepository.findAll();
    return products.map(toProductDto);
  }

  async getProductById(id: number): Promise<ProductDto> {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw createAppError("NOT_FOUND");
    }
    return toProductDto(product);
  }

  async createProduct(input: CreateProductInput): Promise<ProductDto> {
    const product = await productsRepository.create({
      nombre_producto: input.nombre_producto,
      descripcion: input.descripcion,
      precio: String(input.precio),
      stock: input.stock,
    });
    return toProductDto(product);
  }

  async updateProduct(
    id: number,
    input: CreateProductInput,
  ): Promise<ProductDto> {
    const product = await productsRepository.update(id, {
      nombre_producto: input.nombre_producto,
      descripcion: input.descripcion,
      precio: String(input.precio),
      stock: input.stock,
    });
    if (!product) {
      throw createAppError("NOT_FOUND");
    }
    return toProductDto(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await productsRepository.delete(id);
    if (!product) {
      throw createAppError("NOT_FOUND");
    }
  }

  getAllImagenes() {
    return productsRepository.findAllImagenes();
  }

  getImagenesByProductId(id: number) {
    return productsRepository.findImagenesByProductId(id);
  }

  addImagen(id_producto: number, url: string) {
    return productsRepository.addImagen(id_producto, url);
  }

  getAllCategorias() {
    return productsRepository.findAllCategorias();
  }

  getProductsByCategoria(id_categoria: number) {
    return productsRepository.findByCategoria(id_categoria).then((products) =>
      products.map(toProductDto),
    );
  }

  getCategoriasByProductId(id_producto: number) {
    return productsRepository.findCategoriasByProductId(id_producto);
  }

  addProductCategoria(id_producto: number, id_categoria: number) {
    return productsRepository.addProductCategoria(id_producto, id_categoria);
  }

  updateProductCategoria(id_producto: number, id_categoria: number) {
    return productsRepository.updateProductCategoria(id_producto, id_categoria);
  }

  deleteProductCategoria(id_producto: number, id_categoria: number) {
    return productsRepository.deleteProductCategoria(id_producto, id_categoria);
  }
}

export const productsService = new ProductsService();
