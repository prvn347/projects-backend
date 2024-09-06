import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import axios from "axios";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Transformations } from "../types/transformType";
import { TransfromService } from "../utils/processingUtils";
import { prisma } from "../db";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);
export class imageService {
  async uploadImage(userId: number, filePath: string, fileName: string) {
    try {
      const fileContent = await fs.readFile(filePath);
      const transaction = await prisma.$transaction(async (tx) => {
        const { data } = await supabase.storage
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

  async transfromImage(
    imageId: number,
    filePath: string,
    transformMeta: Transformations
  ) {
    try {
      const transaction = await prisma.$transaction(
        async (tx) => {
          const findUrl = await tx.image.findFirst({
            where: { id: imageId },
          });

          if (!findUrl) {
            throw new Error(
              `Image with ID ${imageId} not found in the database.`
            );
          }

          const bucketName = "images";
          const expiresIn = 60;

          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from(bucketName)
              .createSignedUrl(findUrl.name, expiresIn);

          if (signedUrlError || !signedUrlData?.signedUrl) {
            throw new Error("Failed to create signed URL for the image.");
          }
          const originalImageUrl = signedUrlData.signedUrl;

          // Download the image
          const { data: inputBuffer } = await axios.get<Buffer>(
            originalImageUrl,
            {
              responseType: "arraybuffer",
            }
          );
          const uniqueName = `${uuidv4()}-${findUrl.name}`;
          const outputPath = path.join(filePath, uniqueName);
          await TransfromService(transformMeta, inputBuffer, outputPath);

          const fileContent = await fs.readFile(outputPath);

          // Upload the resized image
          const uploadPath = `${findUrl.userId}/edited-${uniqueName}`;
          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(uploadPath, fileContent);

          if (uploadError) {
            throw new Error(
              "Failed to upload resized image to Supabase storage."
            );
          }
          await supabase.storage
            .from(bucketName)
            .createSignedUrl(
              `${findUrl.userId}/edited-${uniqueName}`,
              expiresIn
            );

          const { data: resizeUrlData, error: resizeUrlError } =
            await supabase.storage
              .from(bucketName)
              .createSignedUrl(uploadPath, expiresIn);

          if (resizeUrlError || !resizeUrlData?.signedUrl) {
            throw new Error(
              "Failed to create signed URL for the resized image."
            );
          }
          await fs.unlink(outputPath);
          const dbTransform = await tx.transformation.create({
            data: {
              name: uploadPath,
              imageId: imageId,
              transformationMeta: JSON.stringify(transformMeta),
              signedUrl: resizeUrlData.signedUrl,
            },
          });

          return dbTransform;
        },
        { timeout: 10000 }
      );

      return transaction;
    } catch (error) {
      console.error("error while transforming image" + error);
      throw new Error("error:" + error);
    }
  }
  async findImage(imageId: number) {
    try {
      const image = await prisma.image.findFirst({
        where: {
          id: imageId,
        },
      });

      return image;
    } catch (error) {
      console.error("error while getting image" + error);
      throw new Error("error:" + error);
    }
  }
  async getImages(initRange: number, limitRange: number) {
    try {
      const transaction = await prisma.$transaction(async (tx) => {
        const count = await tx.image.count();
        const result = await tx.image.findMany({
          skip: initRange, // Skip this many records
          take: limitRange, // Take this many records after skipping
        });

        return { count, images: result };
      });

      return transaction;
    } catch (error) {
      console.error("error while getting range  images" + error);
      throw new Error("error:" + error);
    }
  }
}
