import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  console.log("hi from ehalth route");
  res.send("hi how are you i am your server talking from port 3000");
});

export default router;
