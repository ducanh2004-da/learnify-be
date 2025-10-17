import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

@ObjectType()
export class CompleteCourseReturn {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsString()
  courseName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  abstract?: string | null;

  @Field(() => [String])
  keyLearnings: string[]; // <-- sửa thành mảng

  @Field(() => Boolean)
  isDone: boolean;
}
