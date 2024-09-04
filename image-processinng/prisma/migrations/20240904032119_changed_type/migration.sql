/*
  Warnings:

  - Changed the type of `transformationType` on the `Transformation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transformation" DROP COLUMN "transformationType",
ADD COLUMN     "transformationType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "TransformationType";
