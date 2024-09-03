import { Application } from "express";
import userRoutes from "./user";
import imageRoutes from "./images";
import swaggerUi from "swagger-ui-express";

export const initializeRoutes = (app: Application) => {
  //   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/user", userRoutes);
  app.use("/image", imageRoutes);
};
