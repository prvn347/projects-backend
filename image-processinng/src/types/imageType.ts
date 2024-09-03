import { z } from "zod";

export type image = {
  name: string;
  description?: string;
  url: string;
};

export const imageUploadSchema = z.object({
  file: z.instanceof(File),
});
