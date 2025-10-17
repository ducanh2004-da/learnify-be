import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray, IsNumber } from 'class-validator';
import { InProgressCourseReturn } from './inProgressCourseReturn.dto';

@ObjectType()
export class InProgressCourseResponse {
  @Field(() => String)
  @IsNumber()
  count: number;

  @Field(() => [InProgressCourseReturn], { nullable: true })
  data: InProgressCourseReturn[] | null;

  @Field(() => Float, { nullable: true })
  progress?: number | 0;

}
