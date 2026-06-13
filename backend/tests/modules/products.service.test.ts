import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProductsService } from "../../src/modules/products/products.service.js";
import { productsRepository } from "../../src/modules/products/products.repository.js";
import { mockProducto, validProductBody } from "../helpers/fixtures.js";

vi.mock("../../src/modules/products/products.repository.js", () => ({
  productsRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findAllImagenes: vi.fn(),
    findImagenesByProductId: vi.fn(),
    addImagen: vi.fn(),
    findAllCategorias: vi.fn(),
    findByCategoria: vi.fn(),
    findCategoriasByProductId: vi.fn(),
    addProductCategoria: vi.fn(),
    updateProductCategoria: vi.fn(),
    deleteProductCategoria: vi.fn(),
  },
}));

describe("ProductsService (unit)", () => {
  const service = new ProductsService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("mapea precio string a number en el DTO", async () => {
      vi.mocked(productsRepository.findAll).mockResolvedValue([mockProducto]);

      const products = await service.getAllProducts();

      expect(products).toHaveLength(1);
      expect(products[0]?.precio).toBe(25.99);
      expect(products[0]?.nombre_producto).toBe("Monstera Deliciosa");
    });
  });

  describe("getProductById", () => {
    it("retorna producto cuando existe", async () => {
      vi.mocked(productsRepository.findById).mockResolvedValue(mockProducto);

      const product = await service.getProductById(1);

      expect(product.id_producto).toBe(1);
      expect(product.precio).toBe(25.99);
    });

    it("lanza error 404 si no existe", async () => {
      vi.mocked(productsRepository.findById).mockResolvedValue(undefined);

      await expect(service.getProductById(999)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe("createProduct", () => {
    it("persiste precio como string en repositorio", async () => {
      vi.mocked(productsRepository.create).mockResolvedValue(mockProducto);

      await service.createProduct(validProductBody);

      expect(productsRepository.create).toHaveBeenCalledWith({
        nombre_producto: validProductBody.nombre_producto,
        descripcion: validProductBody.descripcion,
        precio: "12.99",
        stock: validProductBody.stock,
      });
    });
  });

  describe("deleteProduct", () => {
    it("elimina producto existente", async () => {
      vi.mocked(productsRepository.delete).mockResolvedValue({
        id_producto: 1,
      });

      await expect(service.deleteProduct(1)).resolves.toBeUndefined();
    });
  });
});
