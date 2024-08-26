/*
  Warnings:

  - You are about to drop the column `accessPlatform` on the `Url` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Url_id_key";

-- AlterTable
ALTER TABLE "Url" DROP COLUMN "accessPlatform",
ADD CONSTRAINT "Url_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ClickedSite" (
    "id" SERIAL NOT NULL,
    "urlId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ClickedSite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClickedSite" ADD CONSTRAINT "ClickedSite_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
