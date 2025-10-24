import { Injectable } from '@nestjs/common';
import { NoteDAO } from './note.dao';
import { CreateNoteInput, UpdateNoteInput } from '@/common/model/DTO/notes/note.input';
import { Notes } from '@prisma/client';
import { NoteReturn } from '@/common/model/DTO/notes/noteReturn.dto';
import { INoteService, NOTE_SERVICE_TOKEN } from './note.interface';

@Injectable()
export class NoteService implements INoteService {
    constructor(private readonly noteDAO: NoteDAO) { }
    async getNoteByEnrollment(enrollmentId: string): Promise<Notes[] | null> {
        if(!enrollmentId) {
            throw new Error("Enrollment ID is required");
        }
        return this.noteDAO.getNoteByEnrollment(enrollmentId);
    }
    async createNote(data: CreateNoteInput): Promise<Notes> {
        return this.noteDAO.createNote(data);
    }
    async updateNote(id: string, data: UpdateNoteInput): Promise<Notes> {
        return this.noteDAO.updateNote(id, data);
    }
    async deleteNote(id: string): Promise<Notes> {
        if(!id) {
            throw new Error("Note ID is required");
        }
        return this.noteDAO.deleteNote(id);
    }
}
