import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

connectDatabase()
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch((err) => console.error("Error de conexión a PostgreSQL:", err));

app.listen(env.PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${env.PORT}`);
});
