import { CreateMindMapInput, UpdateMindMapInput } from '@/common/model/DTO/mindmap/mindmap.input';
import { SectionResponse } from '@/common/model/DTO/section/section.response';
import { MindMap, MindMapNode } from '@prisma/client';
import { CreateNodeInput, UpdateNodeInput } from '@/common/model/DTO/mindmap/node.input';
import { Section } from '@prisma/client';
export interface ISectionService {
    getSectionByLesson(lessonId: string): Promise<Section[] | null>;
}
export const SECTION_SERVICE_TOKEN = 'ISectionService';
