import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

@ObjectType()
export class NoteReturn {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsString()
  content: string;

  @Field(() => String)
  @IsUUID()
  enrollmentId: string;

  @Field(() => Date)
  createdAt: Date;
}
