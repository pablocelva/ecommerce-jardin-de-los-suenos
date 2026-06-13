import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { env } from "../../config/env.js";
import { AppError, createAppError } from "../errors/AppError.js";

export interface JwtPayload {
  email: string;
}

export function signToken(data: JwtPayload): string {
  return jwt.sign(data, env.JWT_SECRET, {
    algorithm: "HS384",
    expiresIn: "24h",
  });
}

export function verifyToken(token: string): JwtPayload {
  if (!token || typeof token !== "string") {
    throw createAppError("INVALID_TOKEN");
  }
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function getHeadersToken(req: Request): string {
  const authorization = req.header("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw createAppError("INVALID_TOKEN");
  }
  return authorization.split("Bearer ")[1] ?? "";
}

export function verifyTokenMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const token = getHeadersToken(req);
    req.user = verifyToken(token);
    next();
  } catch {
    next(createAppError("INVALID_TOKEN"));
  }
}
