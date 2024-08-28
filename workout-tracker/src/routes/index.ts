import { Application } from "express";
import userRoutes from "./user";
import workRoutes from "./workout";
import healthRoutes from "./health";

export const initializeRoutes = (app: Application) => {
  console.log("hi from initialization route");
  app.use("/user", userRoutes);
  app.use("/workout", workRoutes);
  app.use("/health", healthRoutes);
};
