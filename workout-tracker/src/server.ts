import express from "express";
import { initializeRoutes } from "./routes";
import cors from "cors";

const app = express();

const startServer = () => {
  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  initializeRoutes(app);
  console.log("initialized routes");
  app.listen(4000, () => {
    console.log("Server is running on PORT 4000");
  });
};

startServer();
