import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { productsRepository } from "../../src/modules/products/products.repository.js";
import { signToken } from "../../src/shared/lib/jwt.js";
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

describe("Products routes (integration · Vitest + Supertest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/productos/", () => {
    it("lista productos sin autenticación", async () => {
      vi.mocked(productsRepository.findAll).mockResolvedValue([mockProducto]);

      const res = await request(app).get("/api/productos/");

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].precio).toBe(25.99);
    });
  });

  describe("GET /api/productos/:id", () => {
    it("retorna 404 si el producto no existe", async () => {
      vi.mocked(productsRepository.findById).mockResolvedValue(undefined);

      const res = await request(app).get("/api/productos/999");

      expect(res.status).toBe(404);
    });

    it("retorna producto por id", async () => {
      vi.mocked(productsRepository.findById).mockResolvedValue(mockProducto);

      const res = await request(app).get("/api/productos/1");

      expect(res.status).toBe(200);
      expect(res.body.nombre_producto).toBe("Monstera Deliciosa");
    });
  });

  describe("POST /api/productos/", () => {
    it("requiere token para crear producto", async () => {
      const res = await request(app)
        .post("/api/productos/")
        .send(validProductBody);

      expect(res.status).toBe(401);
    });

    it("crea producto con token válido", async () => {
      vi.mocked(productsRepository.create).mockResolvedValue(mockProducto);
      const token = signToken({ email: "admin@example.com" });

      const res = await request(app)
        .post("/api/productos/")
        .set("Authorization", `Bearer ${token}`)
        .send(validProductBody);

      expect(res.status).toBe(201);
      expect(res.body.id_producto).toBe(1);
    });
  });

  describe("GET /api/productos/categorias", () => {
    it("lista categorías", async () => {
      vi.mocked(productsRepository.findAllCategorias).mockResolvedValue([
        { id_categoria: 1, nombre_categoria: "Plantas de Interior" },
      ]);

      const res = await request(app).get("/api/productos/categorias");

      expect(res.status).toBe(200);
      expect(res.body[0].nombre_categoria).toBe("Plantas de Interior");
    });
  });
});
