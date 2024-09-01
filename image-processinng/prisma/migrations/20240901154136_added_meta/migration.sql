/*
  Warnings:

  - You are about to drop the column `desc` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `TransformationMeta` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[url]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta` to the `Transformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transformation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TransformationMeta" DROP CONSTRAINT "TransformationMeta_transformationId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "desc",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Transformation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "meta" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "TransformationMeta";

-- CreateIndex
CREATE UNIQUE INDEX "Image_url_key" ON "Image"("url");
