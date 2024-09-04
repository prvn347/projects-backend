import express from "express";
import { initializeRoutes } from "./routes";
import cors from "cors";
export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initializeRoutes(app);

export const startServer = () => {
  app.listen(4000, () => {
    console.log("Server is running on PORT 4000");
  });
};
