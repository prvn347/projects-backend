import { imageService } from "../services/image";
import { image } from "../types/imageType";

export class imageController {
  imageService = new imageService();
  async uploadImage(userId: number, fileName: string, url: string) {
    try {
      return await this.imageService.uploadImage(userId, fileName, url);
    } catch (error) {
      return new Error(" error while uploading data");
    }
  }
}
