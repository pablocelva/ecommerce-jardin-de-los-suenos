import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { setupSwaggerRoutes } from "./docs/swagger.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";
import {
  registerQuery,
  registerResponse,
} from "./shared/middlewares/query-logger.middleware.js";

const app: Express = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(registerQuery);
app.use(registerResponse);

setupSwaggerRoutes(app);

app.use("/api", apiRoutes);

app.use(errorMiddleware);

export default app;
