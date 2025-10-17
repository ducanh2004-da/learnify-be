import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';
import { MindMapResponse } from './mindmapResponse.dto';

@ObjectType()
export class MindMapReturn {
  @Field(() => String)
  @IsString()
  message: string;

  @Field(() => MindMapResponse)
  data: MindMapResponse | null;
}
