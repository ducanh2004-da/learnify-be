/*
  Warnings:

  - You are about to drop the column `courseId` on the `Progress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[progressId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,courseId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "role" ADD VALUE 'REVIEWER';

-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_courseId_fkey";

-- DropIndex
DROP INDEX "Progress_userId_courseId_key";

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "progressId" TEXT;

-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "courseId";

-- CreateIndex
CREATE INDEX "Course_courseName_idx" ON "Course"("courseName");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_progressId_key" ON "Enrollment"("progressId");

-- CreateIndex
CREATE INDEX "Enrollment_enrolledAt_idx" ON "Enrollment"("enrolledAt");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");

-- CreateIndex
CREATE INDEX "Lesson_lessonName_idx" ON "Lesson"("lessonName");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_key" ON "Progress"("userId");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "Progress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
