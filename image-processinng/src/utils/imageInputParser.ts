import { ZodError } from "zod";
import { imageUploadSchema } from "../types/imageType";

export class imageInputParser {
  static validateImageInput(imageData: Buffer) {
    try {
      const check = imageUploadSchema.parse(imageData);
      return check;
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error for image input:", error.errors);
      } else {
        console.error("Unexpected error while validating image input:", error);
      }
      throw error;
    }
  }
}
