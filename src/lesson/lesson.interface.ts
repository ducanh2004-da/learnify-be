import { Lesson } from '@prisma/client';
import { CreateLessonFromAiInput } from '@/common/model/DTO/lesson/create-lesson.dto';
import { UpdateLessonDto } from '@/common/model/DTO/lesson/update-lesson.dto';
import { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
export interface ILessonService {
    sendFileToAiAndSave(args: {course_id: string;file: FileUpload;});
    getLessonById(id: string): Promise<Lesson | null>;
    getLessonsByCourseId(id: string): Promise<Lesson[]>;
    getAllLessons(): Promise<Lesson[]>;
    updateLesson(data: UpdateLessonDto): Promise<Lesson>;
    deleteLesson(id: string): Promise<Lesson>;
    markDone(id: string, isDone: boolean): Promise<Lesson>;
}
export const LESSON_SERVICE_TOKEN = 'ILessonService';
