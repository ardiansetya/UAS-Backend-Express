/*
  Warnings:

  - You are about to drop the column `memberId` on the `comments` table. All the data in the column will be lost.
  - Added the required column `userId` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_memberId_fkey";

-- DropIndex
DROP INDEX "comments_memberId_idx";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "memberId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "course_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
