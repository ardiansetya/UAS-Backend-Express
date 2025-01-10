/*
  Warnings:

  - Added the required column `url` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "url" TEXT NOT NULL;
