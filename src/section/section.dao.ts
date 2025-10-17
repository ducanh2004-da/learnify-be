import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { Section } from '@prisma/client';
import { CreateMindMapInput, UpdateMindMapInput } from '@/common/model/DTO/mindmap/mindmap.input';
import { CreateNodeInput, UpdateNodeInput } from '@/common/model/DTO/mindmap/node.input';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class SectionDAO {
    constructor(private readonly primas: PrismaService){}

    async getSectionByLesson(lessonId: string): Promise<Section[] | null>{
        return this.primas.section.findMany({
            where: {lessonId},
        })
    }
}