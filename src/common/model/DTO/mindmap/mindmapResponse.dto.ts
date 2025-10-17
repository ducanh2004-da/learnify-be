import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';
import { NodeResponse } from './nodeResponse.dto';

@ObjectType()
export class MindMapResponse {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsUUID()
  courseId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => [NodeResponse], {nullable: 'itemsAndList'})
  nodes?: NodeResponse[] | null;
}
