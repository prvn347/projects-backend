/*
  Warnings:

  - You are about to drop the column `meta` on the `Transformation` table. All the data in the column will be lost.
  - You are about to drop the column `transformationType` on the `Transformation` table. All the data in the column will be lost.
  - Added the required column `transformationMeta` to the `Transformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transformation" DROP COLUMN "meta",
DROP COLUMN "transformationType",
ADD COLUMN     "transformationMeta" TEXT NOT NULL;
