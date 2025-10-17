import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional } from 'class-validator';

@InputType()
export class CreateMindMapInput {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  courseId: string;
}

@InputType()
export class UpdateMindMapInput {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  courseId?: string;
}

