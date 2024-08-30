import { Router, Response } from "express";
import { admin, AuthRequest } from "../middlewares/admin";
import { workoutControllers } from "../controllers/workout";

const router = Router();

router.use(admin);
const workoutController = new workoutControllers();
router.post("/create", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;
    const workoutData = req.body;
    const result = await workoutController.createWorkout(
      parseInt(userId),
      workoutData
    );

    if (result instanceof Error) {
      res.status(403).json("internal error");
    }

    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(501).json({ error });
  }
});

router.post("/update", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;
    const workoutData = req.body;
    const result = await workoutController.updateWorkout(
      parseInt(userId),
      workoutData
    );

    if (result instanceof Error) {
      res.status(403).json("internal error");
    }

    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(501).json({ error });
  }
});

export default router;
