import { CreateMindMapInput, UpdateMindMapInput } from '@/common/model/DTO/mindmap/mindmap.input';
import { MindMapResponse } from '@/common/model/DTO/mindmap/mindmapResponse.dto';
import { MindMap, MindMapNode } from '@prisma/client';
import { CreateNodeInput, UpdateNodeInput } from '@/common/model/DTO/mindmap/node.input';
export interface IMindmapService {
    getMindMapByCourse(courseId: string): Promise<MindMap | null>;
    createMindMap(data: CreateMindMapInput): Promise<MindMap>;
    updateMindMap(id: string, data: UpdateMindMapInput): Promise<MindMap>;
    deleteMindMap(id: string): Promise<MindMap>;
    createNode(data: CreateNodeInput): Promise<MindMapNode>;
    updateNode(id: string, data: UpdateNodeInput): Promise<MindMapNode>;
    deleteNode(id: string): Promise<MindMapNode>;
    getNodeById(id: string): Promise<MindMapNode | null>;
    getAllNodeMindMap(mindMapId: string): Promise<MindMapNode[] | null>;
}
export const MINDMAP_SERVICE_TOKEN = 'IMindmapService';
