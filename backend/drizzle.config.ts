import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const dbSsl = process.env.DB_SSL === "true";

export default defineConfig({
  schema: "./src/database/schema/index.ts",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "ecommerce",
    ...(dbSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  },
});
