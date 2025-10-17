/*
  Warnings:

  - You are about to drop the column `abstract` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `urlPdf` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "abstract",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "rawResponse" JSONB,
ADD COLUMN     "urlPdf" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "documents_courseId_idx" ON "documents"("courseId");
