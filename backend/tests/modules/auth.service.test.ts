import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../src/modules/auth/auth.service.js";
import { authRepository } from "../../src/modules/auth/auth.repository.js";
import { verifyPassword } from "../../src/shared/lib/password.js";
import { signToken } from "../../src/shared/lib/jwt.js";
import { AppError } from "../../src/shared/errors/AppError.js";

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

vi.mock("../../src/shared/lib/jwt.js", () => ({
  signToken: vi.fn(() => "token_jwt"),
}));

describe("AuthService", () => {
  const service = new AuthService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("retorna token y usuario en login exitoso", async () => {
      vi.mocked(authRepository.findByEmail).mockResolvedValue({
        id_usuario: 1,
        email: "test@example.com",
        password: "hashedPassword",
        nombre: "Test",
        apellido: "User",
        direccion: "Calle 1",
        telefono: "123",
        rol: "cliente",
        imagen_perfil: null,
        fecha_creacion: new Date(),
      });
      vi.mocked(verifyPassword).mockReturnValue(true);

      const result = await service.login({
        email: "test@example.com",
        password: "123456987",
      });

      expect(result.token).toBe("token_jwt");
      expect(result.usuario.email).toBe("test@example.com");
      expect(signToken).toHaveBeenCalledWith({ email: "test@example.com" });
    });

    it("lanza error si el correo no está registrado", async () => {
      vi.mocked(authRepository.findByEmail).mockResolvedValue(undefined);

      await expect(
        service.login({ email: "test@test.com", password: "123" }),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
