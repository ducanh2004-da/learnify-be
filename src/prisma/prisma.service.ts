import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
  async cleanDb() {
    return this.$transaction([
      this.systemPrompt.deleteMany(),
      this.user.deleteMany(),
      this.conversation.deleteMany(),
      this.conversation.deleteMany(),
      this.message.deleteMany(),
      this.lesson.deleteMany(),
      this.progress.deleteMany(),
      this.enrollment.deleteMany(),
      this.course.deleteMany()
    ])
  }
}
