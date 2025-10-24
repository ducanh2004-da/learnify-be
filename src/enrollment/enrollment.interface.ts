import { CreateEnrollmentInput } from '@/common/model/DTO/enrollment/enrollment.input';
import { EnrollmentResponse } from '@/common/model/DTO/enrollment/enrollment.response';
import { CompleteCourseResponse } from '@/common/model/DTO/profile/completeCourse.response';
import { InProgressCourseResponse } from '@/common/model/DTO/profile/inProgressCourse.response';  
export interface IEnrollmentService {
    enrollUserToCourse(input: CreateEnrollmentInput): Promise<EnrollmentResponse>;
    getUserEnrollments(userId: string): Promise<EnrollmentResponse[]>;
    countSuccessEnrollments(userId: string): Promise<CompleteCourseResponse | null>;
    countInProgressEnrollments(userId: string): Promise<InProgressCourseResponse | null>;
}
export const ENROLLMENT_SERVICE_TOKEN = 'IEnrollmentService';
