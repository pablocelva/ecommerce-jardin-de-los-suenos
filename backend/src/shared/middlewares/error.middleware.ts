import type { Request, Response, NextFunction } from "express";
import { AppError, createAppError } from "../errors/AppError.js";

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(err, "Error desde el middleware");

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      id: err.id,
      message: err.message,
      description: err.description,
    });
    return;
  }

  const messageMap: Record<string, keyof typeof import("../errors/AppError.js").ERROR_CATALOG> = {
    "El correo no está registrado": "EMAIL_NOT_REGISTERED",
    "Credenciales incorrectas": "INVALID_CREDENTIALS",
    "Correo ya registrado": "EMAIL_ALREADY_EXISTS",
    "No se encontró la orden": "ORDER_NOT_FOUND",
  };

  const catalogKey = messageMap[err.message];
  if (catalogKey) {
    const appError = createAppError(catalogKey);
    res.status(appError.statusCode).json({
      id: appError.id,
      message: appError.message,
      description: appError.description,
    });
    return;
  }

  const serverError = createAppError("SERVER_ERROR");
  res.status(serverError.statusCode).json({
    id: serverError.id,
    message: serverError.message,
    description: serverError.description,
  });
}
