import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../src/modules/auth/auth.service.js";
import { authRepository } from "../../src/modules/auth/auth.repository.js";
import { hashPassword, verifyPassword } from "../../src/shared/lib/password.js";
import { signToken } from "../../src/shared/lib/jwt.js";
import { AppError } from "../../src/shared/errors/AppError.js";
import { mockUsuario, validRegisterBody } from "../helpers/fixtures.js";

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

describe("AuthService (unit)", () => {
  const service = new AuthService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("retorna token y usuario en login exitoso", async () => {
      vi.mocked(authRepository.findByEmail).mockResolvedValue(mockUsuario);
      vi.mocked(verifyPassword).mockReturnValue(true);

      const result = await service.login({
        email: "test@example.com",
        password: "123456987",
      });

      expect(result.token).toBe("token_jwt");
      expect(result.usuario.email).toBe("test@example.com");
      expect(result.usuario).not.toHaveProperty("password");
      expect(signToken).toHaveBeenCalledWith({ email: "test@example.com" });
    });

    it("lanza error si el correo no está registrado", async () => {
      vi.mocked(authRepository.findByEmail).mockResolvedValue(undefined);

      await expect(
        service.login({ email: "test@test.com", password: "123" }),
      ).rejects.toMatchObject({ id: "emailNoRegistrado", statusCode: 400 });
    });

    it("lanza error si la contraseña es incorrecta", async () => {
      vi.mocked(authRepository.findByEmail).mockResolvedValue(mockUsuario);
      vi.mocked(verifyPassword).mockReturnValue(false);

      await expect(
        service.login({ email: "test@example.com", password: "wrong" }),
      ).rejects.toMatchObject({ id: "credencialesInvalidas", statusCode: 400 });
    });
  });

  describe("register", () => {
    it("registra usuario y retorna token", async () => {
      vi.mocked(authRepository.findByEmail).mockResolvedValue(undefined);
      vi.mocked(authRepository.create).mockResolvedValue({
        ...mockUsuario,
        email: validRegisterBody.email,
      });

      const result = await service.register(validRegisterBody);

      expect(hashPassword).toHaveBeenCalledWith(validRegisterBody.password);
      expect(result.token).toBe("token_jwt");
      expect(result.usuario.email).toBe(validRegisterBody.email);
    });

    it("lanza error si el correo ya existe", async () => {
      vi.mocked(authRepository.findByEmail).mockResolvedValue(mockUsuario);

      await expect(service.register(validRegisterBody)).rejects.toBeInstanceOf(
        AppError,
      );
    });
  });

  describe("getUserById", () => {
    it("retorna datos públicos del usuario", async () => {
      vi.mocked(authRepository.findById).mockResolvedValue(mockUsuario);

      const user = await service.getUserById(1);

      expect(user.email).toBe(mockUsuario.email);
      expect(user).not.toHaveProperty("password");
    });

    it("lanza error si no existe", async () => {
      vi.mocked(authRepository.findById).mockResolvedValue(undefined);

      await expect(service.getUserById(999)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe("deleteUser", () => {
    it("elimina usuario existente", async () => {
      vi.mocked(authRepository.delete).mockResolvedValue(mockUsuario);

      await expect(service.deleteUser(1)).resolves.toBeUndefined();
    });

    it("lanza error si el usuario no existe", async () => {
      vi.mocked(authRepository.delete).mockResolvedValue(undefined);

      await expect(service.deleteUser(999)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});
