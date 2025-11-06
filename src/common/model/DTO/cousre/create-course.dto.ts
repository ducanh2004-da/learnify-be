import { InputType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';
import { IsOptional, IsString, Length } from 'class-validator';
@InputType()
export class CreateCourseDto {
  @Field(() => String)
  @IsString({ message: 'course name must be string' })
  @Length(1, 100, {message: 'course name must between 1 to 100 character'})
  courseName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'abstract must be string' })
  @Length(0, 500, {message: 'abstract must not exceed 500 character'})
  abstract?: string | null;

  @Field(() => String, { nullable: true })
  @IsString({ message: 'creator id must be string' })
  creatorId: string;
}
