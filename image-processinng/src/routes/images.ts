import { Request, Response, Router } from "express";
import { admin, AuthRequest } from "../middleware/admin";
import multer from "multer";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import { imageController } from "../controllers/image";

const router = Router();

router.use(admin);

const uploadDir = "././uploads"; // Adjust path as needed
async function createUploadDir() {
  try {
    await fs.access(uploadDir); // Check if directory exists
  } catch (err: any) {
    if (err.code === "ENOENT") {
      // If not found, create it
      await fs.mkdir(uploadDir);
    } else {
      console.error("Error checking/creating upload directory:", err);
    }
  }
}
createUploadDir();

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: diskStorage });
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
  console.log(imageId);

  const userId = req.user;

  try {
    const filePath = `${uploadDir}`;

    const result = await imageControllers.transformImage(
      parseInt(imageId),
      filePath
    );

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
