import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { authRepository } from "../../src/modules/auth/auth.repository.js";
import { verifyPassword } from "../../src/shared/lib/password.js";
import { signToken } from "../../src/shared/lib/jwt.js";
import {
  mockUsuario,
  validRegisterBody,
  validOrderBody,
  mockOrder,
} from "../helpers/fixtures.js";

vi.mock("../../src/modules/auth/auth.repository.js", () => ({
  authRepository: {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../src/shared/lib/password.js", () => ({
  hashPassword: vi.fn((p: string) => `hashed_${p}`),
  verifyPassword: vi.fn(),
}));

vi.mock("../../src/modules/orders/orders.repository.js", () => ({
  ordersRepository: {
    findAll: vi.fn(),
    findByUserId: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}));

import { ordersRepository } from "../../src/modules/orders/orders.repository.js";

describe("Auth routes (integration · Vitest + Supertest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("responde 200 con token cuando las credenciales son válidas", async () => {
      vi.mocked(authRepository.findByEmail).mockResolvedValue(mockUsuario);
      vi.mocked(verifyPassword).mockReturnValue(true);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "secret" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.usuario.email).toBe("test@example.com");
    });

    it("responde 400 si el email tiene formato inválido", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "no-es-email", password: "secret" });

      expect(res.status).toBe(400);
      expect(res.body.id).toBe("errorValidacion");
    });
  });

  describe("POST /api/auth/registro", () => {
    it("responde 201 al registrar un usuario nuevo", async () => {
      vi.mocked(authRepository.findByEmail).mockResolvedValue(undefined);
      vi.mocked(authRepository.create).mockResolvedValue({
        ...mockUsuario,
        email: validRegisterBody.email,
      });

      const res = await request(app)
        .post("/api/auth/registro")
        .send(validRegisterBody);

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
    });
  });

  describe("GET /api/auth/usuarios/", () => {
    it("responde 401 sin token", async () => {
      const res = await request(app).get("/api/auth/usuarios/");

      expect(res.status).toBe(401);
    });

    it("responde 200 con token válido", async () => {
      vi.mocked(authRepository.findAll).mockResolvedValue([mockUsuario]);
      const token = signToken({ email: "test@example.com" });

      const res = await request(app)
        .get("/api/auth/usuarios/")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

describe("Orders routes (integration · Vitest + Supertest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/pedidos/", () => {
    it("crea un pedido con datos válidos", async () => {
      vi.mocked(ordersRepository.create).mockResolvedValue(mockOrder);

      const res = await request(app)
        .post("/api/pedidos/")
        .send(validOrderBody);

      expect(res.status).toBe(201);
      expect(res.body.message).toContain("Pedido creado");
      expect(res.body.order.id_compra).toBe(1);
    });

    it("responde 400 si faltan campos requeridos", async () => {
      const res = await request(app)
        .post("/api/pedidos/")
        .send({ id_usuario: 2 });

      expect(res.status).toBe(400);
      expect(res.body.id).toBe("errorValidacion");
    });
  });

  describe("GET /api/pedidos/", () => {
    it("requiere autenticación", async () => {
      const res = await request(app).get("/api/pedidos/");

      expect(res.status).toBe(401);
    });

    it("lista pedidos con token válido", async () => {
      vi.mocked(ordersRepository.findAll).mockResolvedValue([mockOrder]);
      const token = signToken({ email: "admin@example.com" });

      const res = await request(app)
        .get("/api/pedidos/")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.orders).toHaveLength(1);
    });
  });
});

describe("Swagger (integration · Vitest + Supertest)", () => {
  it("expone la spec JSON en /api/docs.json", async () => {
    const res = await request(app).get("/api/docs.json");

    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe("3.0.0");
    expect(res.body.paths["/api/auth/login"]).toBeDefined();
    expect(res.body.paths["/api/productos/"]).toBeDefined();
  });
});
