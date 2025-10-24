import { Injectable } from '@nestjs/common';
import { SectionDAO } from './section.dao';
import { CreateMindMapInput, UpdateMindMapInput } from '@/common/model/DTO/mindmap/mindmap.input';
import { SectionResponse } from '@/common/model/DTO/section/section.response';
import { MindMap, MindMapNode } from '@prisma/client';
import { CreateNodeInput, UpdateNodeInput } from '@/common/model/DTO/mindmap/node.input';
import { BadRequestException } from '@nestjs/common';
import { Section } from '@prisma/client';
import { ISectionService } from './section.interface';
@Injectable()
export class SectionService implements ISectionService {
    constructor(private readonly sectionDAO: SectionDAO){}

    async getSectionByLesson(lessonId: string): Promise<Section[] | null>{
        const section = await this.sectionDAO.getSectionByLesson(lessonId);
        if(!section){
            throw new BadRequestException("Khong tim thay section");
        }
        return section;
    }
}
