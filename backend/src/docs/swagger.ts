import type { OpenAPI } from "./openapi.types.js";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";
import { swaggerPaths, swaggerSchemas } from "./swagger.schemas.js";

export const swaggerSpecs: OpenAPI.Document = {
  openapi: "3.0.0",
  info: {
    title: "API E-commerce Jardín de los Sueños",
    version: "2.0.0",
    description:
      "Documentación OpenAPI del backend TypeScript. Rutas bajo el prefijo /api.",
  },
  servers: [{ url: "http://localhost:3000", description: "Desarrollo local" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: swaggerSchemas,
  },
  paths: swaggerPaths,
};

export function setupSwaggerRoutes(app: Express): void {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  app.get("/api/docs.json", (_req, res) => {
    res.json(swaggerSpecs);
  });
}
