import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { LessonDAO } from '@/lesson/lesson.dao';
import { CreateLessonFromAiInput } from '@/common/model/DTO/lesson/create-lesson.dto';
import { UpdateLessonDto } from '@/common/model/DTO/lesson/update-lesson.dto';
import { Lesson } from '@prisma/client';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service'; // giả sử bạn có PrismaService
import { createReadStream } from 'fs';
import { AiLessonResponse } from '@/common/model/DTO/lesson/ai-response.dto';
import { v4 as uuidv4 } from 'uuid';

interface LecturerSegment {
  start: number;
  end: number;
  text: string;
}

interface ContentItem {
  url_pdf: string;
  lecturer: string;
  lecturer_segment: LecturerSegment[];
}

interface AiResponse {
  lesson_id: string;
  content: ContentItem[];
}

@Injectable()
export class LessonService {
  private readonly logger = new Logger("LessonService");
  private readonly aiBase = 'https://ai-elearning-web.onrender.com';
  constructor(
    private readonly lessonDAO: LessonDAO,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) { }

  private generateUuidFallback() {
    return uuidv4();
  }

  private parseSSEText(accumulated: string): any[] {
    const out: any[] = [];
    const events = accumulated.split(/\r?\n\r?\n/);
    for (const ev of events) {
      const lines = ev.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const dataLines: string[] = [];
      for (const l of lines) {
        if (l.startsWith('data:')) dataLines.push(l.replace(/^data:\s?/, ''));
      }
      if (!dataLines.length) continue;
      const joined = dataLines.join('');
      try { out.push(JSON.parse(joined)); } catch { out.push(joined); }
    }
    return out;
  }

  private async streamToString(input: any): Promise<string> {
    if (typeof input === 'string') return input;
    if (Buffer.isBuffer(input)) return input.toString('utf8');
    if (input && typeof input.on === 'function') {
      return await new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = [];
        input.on('data', (c: Buffer) => chunks.push(Buffer.from(c)));
        input.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        input.on('error', (err: any) => reject(err));
      });
    }
    try { return JSON.stringify(input); } catch { return String(input); }
  }

  // --- (giữ nguyên các hàm utility của bạn: generateUuidFallback, parseSSEText, streamToString, vv) ---

async sendFileToAiAndSave(args: {
  course_id: string;
  file: FileUpload;
}) {
  const { course_id, file } = args;
  const { filename, mimetype, createReadStream } = file;
  const url = `${this.aiBase}/lecturer`;

  const form = new FormData();
  form.append('course_id', course_id);
  form.append('pdf_file', createReadStream(), {
    filename,
    contentType: mimetype,
  });

  const headers = {
    ...form.getHeaders(),
    Accept: 'application/json, text/event-stream, */*',
  };

  let axiosResp;
  try {
    axiosResp = await axios.post(url, form, {
      headers,
      responseType: 'stream',
      maxBodyLength: Infinity,
      timeout: 5 * 60 * 1000,
    });
    this.logger.log('AI response headers: ' + JSON.stringify(axiosResp.headers ?? {}));
  } catch (err: any) {
    if (err?.response) {
      const respBody = await this.streamToString(err.response.data).catch(() => null);
      this.logger.error('AI returned error', {
        status: err.response.status,
        headers: err.response.headers ?? {},
        bodyPreview: respBody ? respBody.slice(0, 2000) : null,
      });
      throw new BadRequestException({
        message: `AI returned ${err.response.status}`,
        detail: respBody ? respBody.slice(0, 2000) : undefined,
      });
    }
    this.logger.error('Request error to AI', err);
    throw err;
  }

  // accumulate stream
  const streamData = axiosResp.data as NodeJS.ReadableStream;
  let accumulated = '';
  await new Promise<void>((resolve, reject) => {
    streamData.on('data', (chunk: Buffer) => {
      const s = chunk.toString('utf8');
      process.stdout.write(s); // optional live logging
      accumulated += s;
    });
    streamData.on('end', () => resolve());
    streamData.on('error', (e) => reject(e));
  });

  // parse robustly (giữ logic parsing của bạn)
  let finalPayload: any = null;
  const contentType = (axiosResp.headers && (axiosResp.headers['content-type'] || axiosResp.headers['Content-Type'])) || '';
  const isSSE = contentType.includes('text/event-stream') || contentType.includes('text/event');

  if (isSSE) {
    const events = this.parseSSEText(accumulated);
    let chosen: any = null;
    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i];
      if (e && (e.lesson_id || e.content || e.rawResponse)) { chosen = e; break; }
    }
    if (!chosen) chosen = events[events.length - 1] ?? { text: accumulated.replace(/(^data:\s*)/gm, '').trim() };
    finalPayload = chosen;
  } else {
    try {
      finalPayload = JSON.parse(accumulated);
    } catch {
      const dataObjRegex = /{[\s\S]*?}/g;
      let m: RegExpExecArray | null;
      const found: any[] = [];
      while ((m = dataObjRegex.exec(accumulated)) !== null) {
        try { found.push(JSON.parse(m[0])); } catch {}
      }
      finalPayload = found.length ? found[found.length - 1] : { text: accumulated.replace(/(^data:\s*)/gm, '').trim() };
    }
  }

  // Normalize content -> map thành nhiều section (mỗi object trong content -> 1 Section)
  const mappedContentForResponse: Array<{
    id: string;
    url_pdf: string | null;
    content: string;
    lecturer_segment?: any[];
  }> = [];

  let firstUrlPdf: string | null = null;

  if (Array.isArray(finalPayload?.content)) {
    for (const c of finalPayload.content) {
      const urlPdf = c?.url_pdf ?? c?.urlPdf ?? null;
      const lecturerText = c?.lecturer ?? c?.content ?? (typeof c === 'string' ? c : JSON.stringify(c));
      const lecturerSegment = Array.isArray(c?.lecturer_segment) ? c.lecturer_segment : (Array.isArray(c?.lecturerSegment) ? c.lecturerSegment : []);
      const id = this.generateUuidFallback();
      mappedContentForResponse.push({
        id,
        url_pdf: urlPdf,
        content: lecturerText,
        lecturer_segment: lecturerSegment,
      });
      if (!firstUrlPdf && urlPdf) firstUrlPdf = urlPdf;
    }
  } else if (typeof finalPayload?.lecturer === 'string') {
    const lecturerText = finalPayload.lecturer;
    const id = this.generateUuidFallback();
    const urlPdf = finalPayload.url_pdf ?? finalPayload.urlPdf ?? null;
    mappedContentForResponse.push({
      id,
      url_pdf: urlPdf,
      content: lecturerText,
      lecturer_segment: Array.isArray(finalPayload.lecturer_segment) ? finalPayload.lecturer_segment : [],
    });
    firstUrlPdf = urlPdf;
  } else if (finalPayload?.text) {
    const id = this.generateUuidFallback();
    mappedContentForResponse.push({ id, url_pdf: null, content: finalPayload.text, lecturer_segment: [] });
  } else {
    const id = this.generateUuidFallback();
    let contentText: string;
    try { contentText = JSON.stringify(finalPayload).slice(0, 20000); } catch { contentText = String(finalPayload); }
    mappedContentForResponse.push({ id, url_pdf: null, content: contentText, lecturer_segment: [] });
  }

  // Build a joined content text for lesson.abstract (optional)
  const contentText = mappedContentForResponse.map(m => m.content).join('\n\n');

  const lessonId = finalPayload?.lesson_id ?? this.generateUuidFallback();
  const lessonName = finalPayload?.title ?? `Lesson from AI ${new Date().toISOString()}`;

  // Prepare section rows for createMany
  const sectionsData = mappedContentForResponse.map((c, idx) => ({
    id: c.id,
    lessonId,
    content: c.content ?? '',
    urlPdf: c.url_pdf ?? null,
    order: idx + 1,
  }));

  // DB transaction: upsert lesson -> delete old sections for lesson -> create new sections
  try {
    await this.prisma.$transaction([
      // upsert lesson
      this.prisma.lesson.upsert({
        where: { id: lessonId },
        update: {
          courseId: course_id,
          abstract: contentText ?? undefined,
          lessonName,
        },
        create: {
          id: lessonId,
          courseId: course_id,
          lessonName,
          abstract: contentText ?? null,
        },
      }),
      // remove old sections for this lesson (so we replace them)
      this.prisma.section.deleteMany({ where: { lessonId } }),
      // insert new sections
      this.prisma.section.createMany({
        data: sectionsData,
        skipDuplicates: true, // safety
      }),
    ]);
  } catch (err) {
    this.logger.error('DB transaction failed while saving lesson/sections', err);
    // Decide whether to rethrow or return partial. Here we rethrow to let caller know.
    throw new InternalServerErrorException('Failed saving lesson/sections');
  }

  // Build response matching AiLessonResponse (include lecturer_segment)
  return {
    lesson_id: finalPayload.lesson_id ?? lessonId,
    content: mappedContentForResponse.map((c) => ({
      url_pdf: (c.url_pdf ?? '') as string,
      content: c.content,
      lecturer_segment: c.lecturer_segment ?? [],
      section_id: c.id, // trả về id section mới tạo để client tham chiếu
    })),
  };
}


  async getLessonById(id: string): Promise<Lesson | null> {
    return this.lessonDAO.getLessonById(id);
  }

  async getLessonsByCourseId(id: string): Promise<Lesson[]> {
    return this.lessonDAO.getLessonsByCourseId(id);
  }
  async getAllLessons(): Promise<Lesson[]> {
    return this.lessonDAO.getAllLessons();
  }
  async updateLesson(data: UpdateLessonDto): Promise<Lesson> {
    return this.lessonDAO.updateLesson(data.id, data);
  }

  async deleteLesson(id: string): Promise<Lesson> {
    return this.lessonDAO.deleteLesson(id);
  }
  async markDone(id: string, isDone: boolean): Promise<Lesson> {
    return this.lessonDAO.markDone(id, isDone);
  }
}
