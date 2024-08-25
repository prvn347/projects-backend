import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs/promises";
import textgears from "textgears-api";
// import path from "path";
const app = express();

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
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

app.post(
  "/notes/grammer",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      let suggestion: string[] = [];
      const fileContent = await fs.readFile(
        uploadDir + "/" + req.file.filename,
        "utf-8"
      );
      const textgearsApi = textgears(process.env.TEXT_API, {
        language: "en-US",
        ai: false,
      });
      console.log(fileContent);
      await textgearsApi
        .checkGrammar(fileContent)
        .then((data) => {
          for (const error of data.response.errors) {
            console.log(
              "Error: %s. Suggestions: %s",
              error.bad,
              error.better.join(", ")
            );
            suggestion.push(
              "Error: %s. Suggestions: %s",
              error.bad,
              error.better.join(", ")
            );
          }
        })
        .catch((err) => {});

      res.json({
        message: "File uploaded successfully",
        filename: req.file.filename,
        fileContent,
        suggestions: suggestion,
      });
    } catch (error) {}
  }
);

app.post(
  "/notes/save",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    try {
      const fileContent = await fs.readFile(
        uploadDir + "/" + req.file.filename,
        "utf-8"
      );

      res.json({
        message: "File uploaded successfully",
        filename: req.file.filename,
        fileContent,
      });
    } catch (error: any) {
      console.error("Error reading uploaded file:", error);
      res.status(500).json({ error: "Error processing file" });
    }
  }
);

app.post("/list", async () => {});

app.post("/returnHtml", async () => {});

app.listen(3000);
