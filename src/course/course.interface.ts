import { CreateCourseDto } from '@/common/model/DTO/cousre/create-course.dto';
import { UpdateCourseDto } from '@/common/model/DTO/cousre/update-course.dto';
import { Course } from '@prisma/client';
export interface ICourseService {
    createCourse(data: CreateCourseDto): Promise<Course>;
    getCourseById(id: string): Promise<Course | null>;
    getAllCourses(): Promise<Course[]>;
    updateCourse(data: UpdateCourseDto): Promise<Course>;
    deleteCourse(id: string): Promise<Course>;
    getCourseByUserId(userId: string): Promise<Course[]>;
}
export const COURSE_SERVICE_TOKEN = 'ICourseService';
