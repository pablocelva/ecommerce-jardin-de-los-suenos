import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "./env.js";
import * as schema from "../database/schema/index.js";

const pool = new pg.Pool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: env.DB_PORT,
  allowExitOnIdle: true,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

export async function connectDatabase(): Promise<void> {
  await pool.query("SELECT 1");
}

export { pool };
