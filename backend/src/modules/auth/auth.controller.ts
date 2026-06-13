import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function handleRegister(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function handleGetUserById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.getUserById(req.params.id as unknown as number);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function handleGetUsers(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function handleUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.updateUser(
      req.params.id as unknown as number,
      req.body,
    );
    res.status(200).json({
      message: "Usuario actualizado correctamente",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function handleDeleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await authService.deleteUser(req.params.id as unknown as number);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    next(error);
  }
}
