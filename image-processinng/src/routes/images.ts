import { Response, Router } from "express";
import { admin, AuthRequest } from "../middleware/admin";
import multer from "multer";
import { imageController } from "../controllers/image";
import { multerStorage } from "../configs/diskStorage";

const router = Router();

router.use(admin);

const Storage = multerStorage();
const upload = multer({ storage: Storage });

const uploadDir = "././uploads";

const imageControllers = new imageController();

router.post(
  "/",
  upload.single("file"),
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const userId = req.user;
    try {
      const filePath = `${uploadDir}/${req.file.filename}`;

      const result = await imageControllers.uploadImage(
        parseInt(userId),
        filePath,
        req.file.filename
      );
      if (result instanceof Error) {
        return res
          .status(403)
          .json({ error: "Error while uploading file try again." });
      }
      res.status(201).json({
        status: "File uploaded successfully",
        filename: req.file.filename,
        result,
      });
    } catch (error) {
      res.status(403).json({ error: error });
    }
  }
);
router.post("/:id/transform", async (req: AuthRequest, res: Response) => {
  const imageId = req.params.id;
  const body = req.body;

  try {
    const filePath = `${uploadDir}`;
    const result = await imageControllers.transformImage(
      parseInt(imageId),
      filePath,
      body
    );
    if (result instanceof Error) {
      return res
        .status(403)
        .json({ error: "Error while transforming file try again." });
    }
    res.status(201).json({
      result,
    });
  } catch (error) {
    res.status(403).json({ error: error });
  }
});

router.post("/:id", async () => {
  try {
  } catch (error) {}
});
router.post("/", async () => {
  try {
  } catch (error) {}
});

export default router;
