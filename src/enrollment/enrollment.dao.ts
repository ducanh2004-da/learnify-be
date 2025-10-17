// enrollment.dao.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Enrollment, Progress, User, Course } from '@prisma/client';
import { ProgressStatus } from '@prisma/client';
import { CompleteCourseResponse } from '@/common/model/DTO/profile/completeCourse.response';
import { CompleteCourseReturn } from '@/common/model/DTO/profile/completeCourseReturn.dto';
import { InProgressCourseResponse } from '@/common/model/DTO/profile/inProgressCourse.response';
import { InProgressCourseReturn } from '@/common/model/DTO/profile/inProgressCourseReturn.dto';

@Injectable()
export class EnrollmentDAO {
  constructor(private readonly prisma: PrismaService) { }

  async findUserById(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async findCourseById(courseId: string): Promise<Course | null> {
    return this.prisma.course.findUnique({ where: { id: courseId } });
  }

  async findEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    return this.prisma.enrollment.findFirst({ where: { userId, courseId } });
  }

  async createEnrollment(userId: string, courseId: string): Promise<Enrollment> {
    return this.prisma.enrollment.create({ data: { userId, courseId } });
  }

  async createProgress(userId: string, courseId: string, totalLessons: number): Promise<Progress> {
    return this.prisma.progress.create({ data: { userId, courseId, percentage: 0, completedLessons: 0, totalLessons } });
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({ where: { userId }, include: { course: true } });
  }
  async countSuccessEnrollments(userId: string): Promise<CompleteCourseResponse | null> {
    const [completeEnrollment, totalCourse] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: {
          userId,
          typeCourse: ProgressStatus.COMPLETED,
        },
        include: { course: true },
      }),
      this.prisma.enrollment.count({
        where: {
          userId,
          typeCourse: ProgressStatus.COMPLETED,
        }
      })
    ]);
    const courses = completeEnrollment
      .map((enr) => enr.course)
      .filter((c): c is Course => c != null);

    const mapped: CompleteCourseReturn[] = courses.map((c) => ({
      id: c.id,
      courseName: c.courseName ?? '',
      abstract: c.abstract ?? null,
      keyLearnings: Array.isArray(c.keyLearnings) ? c.keyLearnings : (c.keyLearnings ? JSON.parse(c.keyLearnings) : []),
      isDone: c.isDone ?? null,
    }));

    return {
      count: totalCourse,
      data: mapped.length ? mapped : [],
    };
  }

  async countInProgressEnrollments(userId: string): Promise<InProgressCourseResponse | null> {
    const [inProgressEnrollment, totalCourse] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: {
          userId,
          typeCourse: ProgressStatus.IN_PROGRESS,
        },
        include: { course: true },
      }),
      this.prisma.enrollment.count({
        where: {
          userId,
          typeCourse: ProgressStatus.IN_PROGRESS,
        }
      })
    ]);
    const courses = inProgressEnrollment
      .map((enr) => enr.course)
      .filter((c): c is Course => c != null);

    const mapped: InProgressCourseReturn[] = courses.map((c) => ({
      id: c.id,
      courseName: c.courseName ?? '',
      abstract: c.abstract ?? null,
      keyLearnings: Array.isArray(c.keyLearnings) ? c.keyLearnings : (c.keyLearnings ? JSON.parse(c.keyLearnings) : []),
      isDone: c.isDone ?? null,
    }));

    return {
      count: totalCourse,
      data: mapped.length ? mapped : [],
      progress: 0
    };
  }
}