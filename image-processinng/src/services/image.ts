import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { image } from "../types/imageType";
const prisma = new PrismaClient();

export class imageService {
  async uploadImage(userId: number, fileName: string, url: string) {
    try {
      const image = await prisma.image.create({
        data: {
          userId: userId,
          name: fileName,
          url: url,
        },
      });

      return image;
    } catch (error) {
      console.error("error while uploading image");
      throw new Error("erro whil db seed");
    }
  }
}
