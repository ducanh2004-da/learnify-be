import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NoteService } from './note.service';
import { CreateNoteInput, UpdateNoteInput } from '@/common/model/DTO/notes/note.input';
import { Notes } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard, RolesGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { NoteResponse } from '@/common/model/DTO/notes/note.response';
import { NoteReturn } from '@/common/model/DTO/notes/noteReturn.dto';

@Resolver(() => NoteReturn)
export class NoteResolver {
    constructor(private readonly noteService: NoteService) { }

    @Query(() => [NoteReturn], { nullable: 'itemsAndList' })
    async getNotesByEnrollment(
        @Args('enrollmentId', { type: () => String }) enrollmentId: string,
    ): Promise<Notes[] | null> {
        try {
            return this.noteService.getNoteByEnrollment(enrollmentId);
        } catch (error) {
            throw new Error("Co loi khi lay note");
        }
    }
    @Mutation(() => NoteResponse)
    @UseGuards(AuthGuard)
    async createNote(@Args('data') data: CreateNoteInput): Promise<NoteResponse> {
        try {
            const createRC = await this.noteService.createNote(data);
            if (!createRC) {
                return {
                    message: "Tao khong thanh cong",
                    data: null
                }
            }
            return {
                message: "Tao thanh cong",
                data: createRC
            }
        } catch (error) {
            return {
                message: "Co loi khi tao note",
                data: null
            }
        }
    }
    @Mutation(() => NoteResponse)
    @UseGuards(AuthGuard)
    async updateNote(@Args('id', { type: () => String }) id: string, @Args('data') data: UpdateNoteInput): Promise<NoteResponse> {
        try {
            const updateRC = await this.noteService.updateNote(id, data);
            if (!updateRC) {
                return {
                    message: "Cap nhat khong thanh cong",
                    data: null
                }
            }
            return {
                message: "Cap nhat thanh cong",
                data: updateRC
            }
        } catch (error) {
            return {
                message: "Co loi khi cap nhat note",
                data: null
            }
        }
    }
    @Mutation(() => NoteResponse)
    @UseGuards(AuthGuard)
    async deleteNote(@Args('id', { type: () => String }) id: string): Promise<NoteResponse> {
        try {
            const deleteRC = await this.noteService.deleteNote(id);
            if (!deleteRC) {
                return {
                    message: "Xoa khong thanh cong",
                    data: null
                }
            }
            return {
                message: "Xoa thanh cong",
                data: deleteRC
            }
        } catch (error) {
            return {
                message: "Co loi khi xoa note",
                data: null
            }
        }
    }
}
