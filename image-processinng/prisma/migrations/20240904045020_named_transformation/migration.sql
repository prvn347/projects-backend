/*
  Warnings:

  - Added the required column `name` to the `Transformation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transformation" ADD COLUMN     "name" TEXT NOT NULL;
