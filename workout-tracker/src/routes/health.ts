import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  console.log("hi from health route");

  res.json({
    result: "hi i am server",
  });
});

export default router;
