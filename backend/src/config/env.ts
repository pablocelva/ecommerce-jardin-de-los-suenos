import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string().min(1),
  DB_PORT: z.coerce.number().default(5432),
  JWT_SECRET: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
