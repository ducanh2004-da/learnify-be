import { Injectable } from '@nestjs/common';
import { MindMapDAO } from './mindmap.dao';
import { CreateMindMapInput, UpdateMindMapInput } from '@/common/model/DTO/mindmap/mindmap.input';
import { MindMapResponse } from '@/common/model/DTO/mindmap/mindmapResponse.dto';
import { MindMap, MindMapNode } from '@prisma/client';
import { CreateNodeInput, UpdateNodeInput } from '@/common/model/DTO/mindmap/node.input';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class MindmapService {
    constructor(private readonly mindmapDAO: MindMapDAO) { }

    async getMindMapByCourse(courseId: string): Promise<MindMap | null> {
        const mindmap = await this.mindmapDAO.getMindMapByCourse(courseId);
        if (!mindmap) {
            throw new BadRequestException("Khong tim thay mind map");
        }
        return mindmap;
    }
    async createMindMap(data: CreateMindMapInput): Promise<MindMap> {
        return this.mindmapDAO.createMindMap({
            ...data
        });
    }
    async updateMindMap(id: string, data: UpdateMindMapInput): Promise<MindMap> {
        return this.mindmapDAO.updateMindMap(id, data);
    }
    async deleteMindMap(id: string): Promise<MindMap> {
        return this.mindmapDAO.deleteMindMap(id);
    }
    async createNode(data: CreateNodeInput): Promise<MindMapNode> {
        if (data.parentId) {
            const parent = await this.mindmapDAO.getNodeById(data.parentId);
            if (!parent) throw new BadRequestException('Parent not found');
            if (data.mindMapId && parent.mindMapId !== data.mindMapId)
                throw new BadRequestException('Parent belongs to different mindmap');
            data.mindMapId = null; 
            const payload: CreateNodeInput = {
                title: data?.title,
                description: data?.description,
                mindMapId: null,
                parentId: data?.parentId || null
            }
            return this.mindmapDAO.createNode(payload);
        }
        if (!data.mindMapId) throw new BadRequestException('mindMapId required');
        return this.mindmapDAO.createNode({
            ...data
        });
    }
    async updateNode(id: string, data: UpdateNodeInput): Promise<MindMapNode> {
        return this.mindmapDAO.updateNode(id, data);
    }
    async deleteNode(id: string): Promise<MindMapNode> {
        return this.mindmapDAO.deleteNode(id);
    }
    async getNodeById(id: string): Promise<MindMapNode | null> {
        const node = await this.mindmapDAO.getNodeById(id);
        if(!node){
            throw new BadRequestException("khong tim thay node");
        }
        return node;
    }
    async getAllNodeMindMap(mindMapId: string): Promise<MindMapNode[] | null> {
        return await this.mindmapDAO.getAllNodeMindMap(mindMapId);
    }
}
