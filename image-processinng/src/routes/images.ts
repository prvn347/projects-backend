import { Request, Response, Router } from "express";
import { admin, AuthRequest } from "../middleware/admin";
import multer from "multer";
import fs from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import { imageController } from "../controllers/image";

const router = Router();

router.use(admin);
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

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
      const fileContent = await fs.readFile(filePath);

      const { data, error } = await supabase.storage
        .from("images")
        .upload(req.file.filename, fileContent, {
          contentType: req.file.mimetype,
        });

      if (error) {
        return res.status(500).json({
          error: "Failed to upload file to Supabase",

          details: error.message,
        });
      }
      const { data: publicData } = supabase.storage
        .from("images")
        .getPublicUrl(req.file.filename);

      await fs.unlink(filePath);

      const result = await imageControllers.uploadImage(
        parseInt(userId),
        req.file.filename,
        publicData.publicUrl
      );

      res.status(201).json({
        status: "File uploaded successfully",
        filename: req.file.filename,
        publicURL: publicData.publicUrl,
        supabaseMeta: data,
        result,
      });
    } catch (error) {
      res.status(403).json({ error: error });
    }
  }
);
router.post("/:id/transform", async () => {
  try {
  } catch (error) {}
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
