/*
  Warnings:

  - You are about to drop the `Node` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Node" DROP CONSTRAINT "Node_mindMapId_fkey";

-- DropTable
DROP TABLE "Node";

-- CreateTable
CREATE TABLE "MindMapNode" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mindMapId" TEXT NOT NULL,
    "order" INTEGER,

    CONSTRAINT "MindMapNode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MindMapNode_mindMapId_idx" ON "MindMapNode"("mindMapId");

-- AddForeignKey
ALTER TABLE "MindMapNode" ADD CONSTRAINT "MindMapNode_mindMapId_fkey" FOREIGN KEY ("mindMapId") REFERENCES "MindMap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
