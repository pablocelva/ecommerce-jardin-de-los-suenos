import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Request, Response, NextFunction } from "express";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logDir = path.join(__dirname, "..", "..", "..", "logs");
const logFilePath = path.join(logDir, "consultas.log");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export function registerQuery(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const timestamp = new Date().toISOString();
  const token = req.headers.authorization ?? "Sin credenciales";
  const body =
    Object.keys(req.body).length > 0
      ? JSON.stringify(req.body)
      : "Sin parámetros";
  const log = `[${timestamp}] Ruta: ${req.originalUrl} | Método: ${req.method} | Token: ${token} | Body: ${body}\n`;

  console.log(log);

  try {
    fs.appendFileSync(logFilePath, log);
  } catch (err) {
    console.error("Error al escribir en el log:", err);
  }

  next();
}

export function registerResponse(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const timestamp = new Date().toISOString();
  const originalSend = res.send.bind(res);

  res.send = function sendWithLog(body?: unknown): Response {
    const responseBody =
      typeof body === "object" ? JSON.stringify(body, null, 2) : body;
    const log = `[${timestamp}] Ruta: ${req.originalUrl} | Método: ${req.method} | Respuesta: ${responseBody}\n`;

    console.log(log);

    try {
      fs.appendFileSync(logFilePath, log);
    } catch (err) {
      console.error("Error al escribir en el log:", err);
    }

    return originalSend(body);
  };

  next();
}
