import sharp from "sharp";
import { Transformations } from "../types/transformType";

export const TransfromService = async (
  transformMeta: Transformations,
  inputBuffer: Buffer,
  outputPath: string
) => {
  try {
    const sharP = await sharp(inputBuffer);
    if (transformMeta.crop) {
      sharP.extract({
        width: transformMeta.crop?.width || 0,
        height: transformMeta.crop?.height || 0,
        top: transformMeta.crop?.x || 0,
        left: transformMeta.crop?.y || 0,
      });
    }
    if (transformMeta.resize) {
      sharP.resize({
        width: transformMeta.resize?.width,
        height: transformMeta.resize?.width,
      });
    }
    if (transformMeta.filters?.grayscale) {
      sharP.greyscale(transformMeta.filters?.grayscale);
    }
    if (transformMeta.rotate) {
      sharP.rotate(transformMeta.rotate);
    }
    if (transformMeta.format) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //   @ts-expect-error
      sharP.toFormat(transformMeta.format || "jpeg");
    }

    await sharP.toFile(outputPath);
  } catch (error: unknown) {
    console.error(error);
    throw new Error("error while processing image" + error);
  }
};
