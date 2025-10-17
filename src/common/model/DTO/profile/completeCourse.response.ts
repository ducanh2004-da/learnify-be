import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray, IsNumber } from 'class-validator';
import { CourseDto } from '../cousre/course.dto';
import { CompleteCourseReturn } from './completeCourseReturn.dto';

@ObjectType()
export class CompleteCourseResponse {
  @Field(() => Number)
  @IsNumber()
  count: number;

  // data là mảng optional của CompleteCourseReturn
  @Field(() => [CompleteCourseReturn], { nullable: true })
  data?: CompleteCourseReturn[] | null;
}
