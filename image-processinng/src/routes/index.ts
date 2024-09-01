import { Application } from "express";
import userRoutes from "./user";

import swaggerUi from "swagger-ui-express";

export const initializeRoutes = (app: Application) => {
  console.log("hi from initialization route");
  //   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/user", userRoutes);
};
