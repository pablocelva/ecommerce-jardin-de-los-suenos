import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

connectDatabase()
  .then(() =>
    console.log(
      `Conectado a PostgreSQL (${env.DB_USER}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME})`,
    ),
  )
  .catch((err: Error) => {
    console.error("Error de conexión a PostgreSQL:");
    console.error(`  Usuario : ${env.DB_USER}`);
    console.error(`  Host    : ${env.DB_HOST}:${env.DB_PORT}`);
    console.error(`  Base    : ${env.DB_NAME}`);
    console.error(`  Detalle : ${err.message}`);
    console.error(
      "\nVerifica DB_USER y DB_PASSWORD en backend/.env (PostgreSQL usa 'postgres', no 'root').",
    );
  });

app.listen(env.PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${env.PORT}`);
});
