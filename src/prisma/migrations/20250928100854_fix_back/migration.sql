/*
  Warnings:

  - You are about to drop the column `progressId` on the `Enrollment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,courseId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `Progress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_progressId_fkey";

-- DropIndex
DROP INDEX "Course_courseName_idx";

-- DropIndex
DROP INDEX "Enrollment_enrolledAt_idx";

-- DropIndex
DROP INDEX "Enrollment_progressId_key";

-- DropIndex
DROP INDEX "Enrollment_userId_courseId_key";

-- DropIndex
DROP INDEX "Lesson_lessonName_idx";

-- DropIndex
DROP INDEX "Progress_userId_key";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "progressId";

-- AlterTable
ALTER TABLE "Progress" ADD COLUMN     "courseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_courseId_key" ON "Progress"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
