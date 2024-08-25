import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs/promises";
import textgears from "textgears-api";
import dotenv from "dotenv";
import showdown from "showdown";
const converter = new showdown.Converter();
dotenv.config();
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
              `Error: ${error.bad}. Suggestions:${error.better.join(", ")} `
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
    } catch (error) {
      console.error(error);
      res.status(500).json({
        errro: error,
      });
    }
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

app.post("/notes/list", async (req: Request, res: Response) => {
  try {
    const files = await fs.readdir(uploadDir);
    console.log("\nCurrent directory filenames:");
    files.forEach((file: string) => {
      console.log(file);
    });

    res.json({
      files: files,
    });
  } catch (error) {
    console.error("Error while reading the directory", error);
    res.status(500).json({
      error: "Failed to read directory",
    });
  }
});

app.post(
  "/notes/render",
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
      const html = converter.makeHtml(fileContent);
      console.log(html);
      res.status(200).json({
        status: "render completed",
        html: html,
      });
    } catch (error) {
      console.error("Error reading uploaded file:", error);
      res.status(500).json({ error: "Error processing file" });
    }
  }
);

app.listen(3000);
