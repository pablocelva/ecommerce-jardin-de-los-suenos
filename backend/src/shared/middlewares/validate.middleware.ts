import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../errors/AppError.js";

type ValidationSource = "body" | "params" | "query";

export function validate<T>(
  schema: ZodSchema<T>,
  source: ValidationSource = "body",
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      next(
        new AppError(
          "errorValidacion",
          firstIssue?.message ?? "Error de validación",
          400,
          result.error.message,
        ),
      );
      return;
    }
    req[source] = result.data;
    next();
  };
}
