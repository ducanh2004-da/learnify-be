import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { FileUpload } from '@/common/model/DTO/document/document.dto';
import { Readable } from 'stream';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  // Validate file type
  private validateFileType(mimetype: string): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ];
    return allowedTypes.includes(mimetype);
  }

  // Validate file size (max 10MB)
  private validateFileSize(size: number): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return size <= maxSize;
  }

  // Convert stream to buffer
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise<Buffer>((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

   async uploadDocument(file: FileUpload, uploadedBy?: string, courseId?: string) {
    const { createReadStream, filename, mimetype } = await file;

    const safeMimetype = mimetype ?? 'application/octet-stream';

    if (!this.validateFileType(safeMimetype)) {
      throw new BadRequestException('Chỉ chấp nhận file PDF, DOC, DOCX');
    }

    const stream: Readable = createReadStream() as unknown as Readable;
    const buffer = await this.streamToBuffer(stream);

    if (!this.validateFileSize(buffer.length)) {
      throw new BadRequestException('File không được vượt quá 10MB');
    }

    const multerFile: Partial<Express.Multer.File> = {
      buffer,
      originalname: filename,
      mimetype: safeMimetype,
      fieldname: 'file',
      size: buffer.length,
    };

    try {
      const result = await this.cloudinary.uploadFile(multerFile as Express.Multer.File, 'documents');

      const fileType = safeMimetype.split('/').pop() ?? 'unknown';

      // Build data object động: nếu courseId tồn tại thì connect relation,
      // nếu không tồn tại và schema yêu cầu course thì Prisma sẽ lỗi (bảo đảm truyền courseId khi cần)
      const createData: any = {
        fileName: filename,
        fileUrl: (result?.secure_url as string) ?? '',
        fileType: fileType,
        fileSize: buffer.length,
        publicId: (result?.public_id as string) ?? '',
        uploadedBy: uploadedBy ?? undefined,
        courseId: courseId ?? undefined,
      };

      // Nếu bạn muốn nối quan hệ Course (nếu schema yêu cầu)
      if (courseId) {
        createData.course = { connect: { id: courseId } };
      }

      const document = await this.prisma.document.create({
        data: createData,
      });

      return {
        success: true,
        message: 'Upload file thành công',
        document,
      };
    } catch (error) {
      const msg = (error as Error)?.message ?? 'Unknown error';
      throw new BadRequestException(`Upload thất bại: ${msg}`);
    }
  }

  async getAllDocuments() {
    return this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocumentById(id: string) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  async deleteDocument(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new BadRequestException('Document không tồn tại');
    }

    // Xóa file trên Cloudinary
    await this.cloudinary.deleteFile(document.publicId);

    // Xóa record trong database
    await this.prisma.document.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Xóa document thành công',
    };
  }
}
