import { IsString, IsOptional, IsUUID } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload/GraphQLUpload.mjs';

@InputType()
export class CreateLessonFromAiInput {

  @Field(() => String)
  @IsString()
  course_id: string;

  @Field(() => String)
  @IsString()
  lessonName: string;

  @Field(() => String)
  @IsString()
  abstract: string;
}
