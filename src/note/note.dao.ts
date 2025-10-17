import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { MindMap, MindMapNode } from '@prisma/client';
import { CreateMindMapInput, UpdateMindMapInput } from '@/common/model/DTO/mindmap/mindmap.input';
import { CreateNodeInput, UpdateNodeInput } from '@/common/model/DTO/mindmap/node.input';
import { BadRequestException } from '@nestjs/common';
import { Notes } from '@prisma/client';
import { CreateNoteInput, UpdateNoteInput } from './../common/model/DTO/notes/note.input';

@Injectable()
export class NoteDAO {
    constructor(private readonly prisma: PrismaService) { }

    async getNoteByEnrollment(enrollmentId: string): Promise<Notes[] | null> {
        const note = await this.prisma.notes.findMany({
            where: { enrollmentId },
        });
        return note;
    }
    async createNote(data: CreateNoteInput): Promise<Notes> {
        return this.prisma.notes.create({
            data,
        })
    }
    async updateNote(id: string, data: UpdateNoteInput): Promise<Notes> {
        return this.prisma.notes.update({
            where: { id },
            data,
        });
    }
    async deleteNote(id: string): Promise<Notes> {
        return this.prisma.notes.delete({
            where: { id }
        });
    }

}