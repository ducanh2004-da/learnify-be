import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional } from 'class-validator';

@InputType()
export class CreateNoteInput {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
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

