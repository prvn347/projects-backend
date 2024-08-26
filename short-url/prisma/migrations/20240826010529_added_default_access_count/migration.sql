/*
  Warnings:

  - You are about to drop the column `shortenId` on the `Url` table. All the data in the column will be lost.
  - Added the required column `shortCode` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" DROP COLUMN "shortenId",
ADD COLUMN     "shortCode" TEXT NOT NULL,
ALTER COLUMN "accessCount" SET DEFAULT 0;
