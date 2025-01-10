/*
  Warnings:

  - You are about to drop the column `fileAttachment` on the `course_contents` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `course_contents` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "course_contents" DROP CONSTRAINT "course_contents_parentId_fkey";

-- AlterTable
ALTER TABLE "course_contents" DROP COLUMN "fileAttachment",
DROP COLUMN "parentId";
