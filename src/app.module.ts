import { Module } from '@nestjs/common';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LessonExplanationModule } from './lesson-explaination/lesson-explanation.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ProgressModule } from './progress/progress.module';
import { SystemPromptModule } from './system-prompt/system-prompt.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { MindmapModule } from './mindmap/mindmap.module';
import { NoteResolver } from './note/note.resolver';
import { NoteModule } from './note/note.module';
import { DocumentModule } from './document/document.module';
import { CloudinaryProvider } from './common/cloudinary/cloudinary.config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SectionModule } from './section/section.module';
import { ChatModule } from './chat/chat.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Thêm driver vào đây
      autoSchemaFile: 'schema.gql',
      debug: true, // Bật debug mode
      introspection: true,
      playground: false,
      csrfPrevention: false, // Tắt CSRF protection
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      // Register Upload scalar runtime resolver so Upload input type can be determined
      resolvers: {
        Upload: require('graphql-upload/GraphQLUpload.mjs').default,
      } as any,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      // expose req và res vào context để resolver có ctx.req / ctx.res
      context: ({ req, res }) => ({ req, res }),
    }),
    CourseModule,
    LessonModule,
    UserModule,
    AuthModule,
    LessonExplanationModule,
    EnrollmentModule,
    ProgressModule,
    SystemPromptModule,
    ConversationModule,
    MessageModule,
    MindmapModule,
    NoteModule,
    DocumentModule,
    CloudinaryModule,
    SectionModule,
    ChatModule,
  ],
  providers: [NoteResolver, CloudinaryProvider],
})
export class AppModule {}
