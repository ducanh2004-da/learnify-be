import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, Length, MinLength } from 'class-validator';

@InputType()
export class CreateNoteInput {
  @Field(() => String)
  @IsString({ message: 'title must be string' })
  @Length(1, 100, { message: 'title must be between 1 to 100 characters' })
  title: string;

  @Field(() => String)
  @IsString({ message: 'content must be string' })
  @MinLength(1, { message: 'content must at least 1 character' })
  content: string;

  @Field(() => String)
  enrollmentId: string;
}

@InputType()
export class UpdateNoteInput {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
  content: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  courseId?: string;
}

