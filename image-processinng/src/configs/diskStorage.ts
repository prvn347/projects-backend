import multer from "multer";
import fs from "fs/promises";

const uploadDir = "././uploads"; // Adjust path as needed
async function createUploadDir() {
  try {
    await fs.access(uploadDir); // Check if directory exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === "ENOENT") {
      // If not found, create it
      await fs.mkdir(uploadDir);
    } else {
      console.error("Error checking/creating upload directory:", err);
    }
  }
}

export const multerStorage = () => {
  try {
    createUploadDir();

    const diskStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/");
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });

    return diskStorage;
  } catch (error) {
    console.error(error);
    throw new Error("Error while creating multer storage");
  }
};
