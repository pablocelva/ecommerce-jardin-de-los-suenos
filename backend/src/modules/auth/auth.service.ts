import type { Usuario } from "../../database/schema/users.schema.js";
import { createAppError } from "../../shared/errors/AppError.js";
import { hashPassword, verifyPassword } from "../../shared/lib/password.js";
import { signToken } from "../../shared/lib/jwt.js";
import { authRepository } from "./auth.repository.js";
import type {
  LoginInput,
  RegisterInput,
  UpdateUserInput,
  UserPublicDto,
} from "./auth.schemas.js";

function toPublicUser(user: Usuario): UserPublicDto {
  return {
    id_usuario: user.id_usuario,
    email: user.email,
    nombre: user.nombre,
    apellido: user.apellido,
    direccion: user.direccion,
    telefono: user.telefono,
    rol: user.rol ?? "cliente",
  };
}

export class AuthService {
  async login(input: LoginInput): Promise<{ token: string; usuario: UserPublicDto }> {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw createAppError("EMAIL_NOT_REGISTERED");
    }

    const isValid = verifyPassword(input.password, user.password);
    if (!isValid) {
      throw createAppError("INVALID_CREDENTIALS");
    }

    const token = signToken({ email: user.email });
    return { token, usuario: toPublicUser(user) };
  }

  async register(
    input: RegisterInput,
  ): Promise<{ token: string; usuario: UserPublicDto }> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw createAppError("EMAIL_ALREADY_EXISTS");
    }

    const passwordHashed = hashPassword(input.password);
    const user = await authRepository.create({
      email: input.email,
      password: passwordHashed,
      nombre: input.nombre,
      apellido: input.apellido,
      direccion: input.direccion,
      telefono: input.telefono,
    });

    const token = signToken({ email: user.email });
    return { token, usuario: toPublicUser(user) };
  }

  async getUserById(id: number): Promise<Omit<UserPublicDto, "id_usuario" | "rol">> {
    const user = await authRepository.findById(id);
    if (!user) {
      throw createAppError("NOT_FOUND");
    }
    return {
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      direccion: user.direccion,
      telefono: user.telefono,
    };
  }

  async getAllUsers(): Promise<UserPublicDto[]> {
    const users = await authRepository.findAll();
    return users.map(toPublicUser);
  }

  async updateUser(
    id: number,
    input: UpdateUserInput,
  ): Promise<{ email: string; password: string; nombre: string | null; apellido: string | null; direccion: string | null; telefono: string | null }> {
    const passwordHashed = hashPassword(input.password);
    const user = await authRepository.update(id, {
      ...input,
      password: passwordHashed,
    });

    if (!user) {
      throw createAppError("NOT_FOUND");
    }

    return {
      email: user.email,
      password: user.password,
      nombre: user.nombre,
      apellido: user.apellido,
      direccion: user.direccion,
      telefono: user.telefono,
    };
  }

  async deleteUser(id: number): Promise<void> {
    const user = await authRepository.delete(id);
    if (!user) {
      throw createAppError("NOT_FOUND");
    }
  }
}

export const authService = new AuthService();
