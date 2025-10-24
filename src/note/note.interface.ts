import { CreateNoteInput, UpdateNoteInput } from '@/common/model/DTO/notes/note.input';
import { Notes } from '@prisma/client';
import { NoteReturn } from '@/common/model/DTO/notes/noteReturn.dto';
export interface INoteService {
    getNoteByEnrollment(enrollmentId: string): Promise<Notes[] | null>;
    createNote(data: CreateNoteInput): Promise<Notes>;
    updateNote(id: string, data: UpdateNoteInput): Promise<Notes>;
    deleteNote(id: string): Promise<Notes>;
}
export const NOTE_SERVICE_TOKEN = 'INoteService';
