import { Application } from "express";
import userRoutes from "./user";
import workRoutes from "./workout";
import healthRoutes from "./health";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("docs/spec.yml");

export const initializeRoutes = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/user", userRoutes);
  app.use("/workout", workRoutes);
  app.use("/health", healthRoutes);
};
