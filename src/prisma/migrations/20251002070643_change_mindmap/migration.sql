-- DropIndex
DROP INDEX "MindMapNode_mindMapId_idx";

-- AlterTable
ALTER TABLE "MindMapNode" ADD COLUMN     "parentId" TEXT;

-- CreateIndex
CREATE INDEX "MindMapNode_mindMapId_parentId_idx" ON "MindMapNode"("mindMapId", "parentId");

-- AddForeignKey
ALTER TABLE "MindMapNode" ADD CONSTRAINT "MindMapNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MindMapNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
