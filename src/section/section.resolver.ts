import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SectionService } from './section.service';
import { SectionResponse } from '@/common/model/DTO/section/section.response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from '@/common/guards/auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CreateMindMapInput, UpdateMindMapInput } from '@/common/model/DTO/mindmap/mindmap.input';
import { MindMapReturn } from '@/common/model/DTO/mindmap/mindmapReturn';
import { NodeReturn } from '@/common/model/DTO/mindmap/nodeReturn';
import { CreateNodeInput, UpdateNodeInput } from '@/common/model/DTO/mindmap/node.input';
import { NodeResponse } from '@/common/model/DTO/mindmap/nodeResponse.dto';
import { Section } from '@prisma/client';

@Resolver(() => SectionResponse)
export class SectionResolver {
    constructor(private readonly sectionService: SectionService){}

    @Query(() => [SectionResponse], {nullable: true})
    async getSectionByLesson(
        @Args('lessonId', {type: () => String}) lessonId: string
    ): Promise<Section[] | null>{
        const section = await this.sectionService.getSectionByLesson(lessonId);
        return section;
    }
}
