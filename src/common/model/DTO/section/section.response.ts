import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

@ObjectType()
export class SectionResponse {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsString()
  urlPdf: string;

  @Field(() => String, { nullable: true })
  @IsString()
  content?: string | null;

  @Field(() => Number)
  @IsOptional()
  order: number;

  @Field(() => String)
  @IsOptional()
  lessonId: string;

  @Field(() => Date)
  @IsOptional()
  createdAt: Date;
}
