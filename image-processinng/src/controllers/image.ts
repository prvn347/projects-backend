import { imageService } from "../services/image";
import { image } from "../types/imageType";

export class imageController {
  imageService = new imageService();
  async uploadImage(userId: number, filePath: string, fileName: string) {
    try {
      return await this.imageService.uploadImage(userId, filePath, fileName);
    } catch (error) {
      return new Error(" error while uploading data");
    }
  }

  async transformImage(imageId: number, filePath: string) {
    try {
      return await this.imageService.transfromImage(imageId, filePath);
    } catch (error) {
      return new Error(" error while transforming data");
    }
  }
}
