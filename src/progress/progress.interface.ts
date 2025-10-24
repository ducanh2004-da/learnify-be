import { UpdateProgressInput } from '@/common/model/DTO/progress/progress.input';
import { ProgressStatus } from '@prisma/client';
export interface IProgressService {
    updateProgress(input: UpdateProgressInput);
    getProgress(progressId: string);
}
export const PROGRESS_SERVICE_TOKEN = 'IProgressService';
