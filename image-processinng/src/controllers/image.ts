import { imageService } from "../services/image";
import { Transformations } from "../types/transformType";

export class imageController {
  imageService = new imageService();
  async uploadImage(userId: number, filePath: string, fileName: string) {
    try {
      return await this.imageService.uploadImage(userId, filePath, fileName);
    } catch (error) {
      if (error instanceof Error) {
        // Log or handle the specific error message
        console.error("Error while uploading image:", error.message);
        return new Error("Error while uploading data: " + error.message);
      } else {
        // Handle non-Error objects
        console.error("Unknown error occurred:", error);
        return new Error("An unknown error occurred while uploading data.");
      }
    }
  }

  async transformImage(
    imageId: number,
    filePath: string,
    transformMeta: Transformations
  ) {
    try {
      return await this.imageService.transfromImage(
        imageId,
        filePath,
        transformMeta
      );
    } catch (error) {
      if (error instanceof Error) {
        // Log or handle the specific error message
        console.error("Error while transforming image:", error.message);
        return new Error("Error while transforming data: " + error.message);
      } else {
        // Handle non-Error objects
        console.error("Unknown error occurred:", error);
        return new Error("An unknown error occurred while transforming data.");
      }
    }
  }
}
