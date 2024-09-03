import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { image } from "../types/imageType";
import fs from "fs/promises";
import sharp, { fit } from "sharp";
import { request } from "express";
import axios from "axios";
const prisma = new PrismaClient();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);
export class imageService {
  async uploadImage(userId: number, filePath: string, fileName: string) {
    try {
      const fileContent = await fs.readFile(filePath);
      const transaction = await prisma.$transaction(async (tx) => {
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, fileContent, {
            contentType: "jpg",
          });
        const { data: publicData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        const image = await tx.image.create({
          data: {
            userId: userId,
            name: fileName,
            url: publicData.publicUrl,
          },
        });

        return { image, data };
      });

      await fs.unlink(filePath);
      return transaction;
    } catch (error) {
      console.error("error while uploading image" + error);
      throw new Error("error:" + error);
    }
  }

  async transfromImage(imageId: number, filePath: string) {
    try {
      const transaction = await prisma.$transaction(async (tx) => {
        const findUrl = await tx.image.findFirst({
          where: {
            id: imageId,
          },
        });
        if (!findUrl) {
          throw new Error(
            `Image with ID ${imageId} not found in the database.`
          );
        }
        const bucketName = "images";
        const expiresIn = 60;

        const path = findUrl?.name;
        const { data, error } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(path, expiresIn);

        const url = data?.signedUrl;

        const input = (await axios({ url: url, responseType: "arraybuffer" }))
          .data as Buffer;
        const shrp = await sharp(input)
          .resize({ width: 1920, height: 1080 })
          .toFile(`uploads/${findUrl.name}`, async (err, info) => {
            if (err) {
              console.error("Error during image processing:", err);
            } else {
              console.log("Image processing completed:", info);
              const fileContent = await fs.readFile(
                `${filePath}/${findUrl.name}`
              );
              const resizedImage = await supabase.storage
                .from(bucketName)
                .upload(
                  `${findUrl.userId}/resized-${findUrl.name}`,
                  fileContent
                );
              console.log(resizedImage.data);
            }
          });

        const resizeUrl = await supabase.storage
          .from(bucketName)
          .createSignedUrl(
            `${findUrl.userId}/resized-${findUrl.name}`,
            expiresIn
          );

        const resizedUrl = resizeUrl.data?.signedUrl;
        console.log(resizedUrl);

        return resizedUrl;
      });

      return transaction;
    } catch (error) {
      console.error("error while transforming image" + error);
      throw new Error("error:" + error);
    }
  }
}
