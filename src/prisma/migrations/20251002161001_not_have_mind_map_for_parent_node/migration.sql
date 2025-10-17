-- DropForeignKey
ALTER TABLE "MindMapNode" DROP CONSTRAINT "MindMapNode_mindMapId_fkey";

-- AlterTable
ALTER TABLE "MindMapNode" ALTER COLUMN "mindMapId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MindMapNode" ADD CONSTRAINT "MindMapNode_mindMapId_fkey" FOREIGN KEY ("mindMapId") REFERENCES "MindMap"("id") ON DELETE SET NULL ON UPDATE CASCADE;
