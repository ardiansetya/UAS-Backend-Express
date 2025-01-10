/*
  Warnings:

  - You are about to drop the column `image` on the `courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "image",
ADD COLUMN     "site" VARCHAR(255);
