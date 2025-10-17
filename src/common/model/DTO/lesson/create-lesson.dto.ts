import { IsString, IsOptional, IsUUID } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateLessonFromAiInput {

  @Field(() => String)
  @IsString()
  course_id: string;

}
