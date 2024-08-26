/*
  Warnings:

  - The `accessPlatform` column on the `Url` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Url" DROP COLUMN "accessPlatform",
ADD COLUMN     "accessPlatform" TEXT[];
