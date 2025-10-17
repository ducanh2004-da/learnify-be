import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { MindMap, MindMapNode } from '@prisma/client';
import { CreateMindMapInput, UpdateMindMapInput } from '@/common/model/DTO/mindmap/mindmap.input';
import { CreateNodeInput, UpdateNodeInput } from '@/common/model/DTO/mindmap/node.input';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class MindMapDAO {
    constructor(private readonly prisma: PrismaService) { }

    async getMindMapByCourse(courseId: string): Promise<MindMap | null> {
        return this.prisma.mindMap.findUnique({
            where: { courseId },
            include: {
                nodes: {
                    include: {
                        children: true,
                    },
                    orderBy: [{ title: 'asc' }, { order: 'asc' }] 
                }
            },
        });
    }


    async createMindMap(data: CreateMindMapInput): Promise<MindMap> {
        return this.prisma.mindMap.create({
            data,
        })
    }
    async updateMindMap(id: string, data: UpdateMindMapInput): Promise<MindMap> {
        return this.prisma.mindMap.update({
            where: { id },
            data,
        });
    }
    async deleteMindMap(id: string): Promise<MindMap> {
        return this.prisma.mindMap.delete({
            where: { id }
        });
    }
    async createNode(data: CreateNodeInput): Promise<MindMapNode> {
        return this.prisma.mindMapNode.create({
            data
        });
    }
    async updateNode(id: string, data: UpdateNodeInput): Promise<MindMapNode> {
        return this.prisma.mindMapNode.update({
            where: { id },
            data,
        });
    }
    async deleteNode(id: string): Promise<MindMapNode> {
        return this.prisma.mindMapNode.delete({
            where: { id }
        });
    }
    async getNodeById(id: string): Promise<MindMapNode | null> {
        return this.prisma.mindMapNode.findUnique({
            where: { id },
            include: { children: true }
        });
    }
    async getAllNodeMindMap(mindMapId: string): Promise<MindMapNode[] | null> {
        const mindmap = this.prisma.mindMapNode.findMany({
            where: { mindMapId },
            include: { children: true },
            orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
        })
        return mindmap;
    }
}