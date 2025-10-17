import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';
import { NodeResponse } from './nodeResponse.dto';

@ObjectType()
export class NodeReturn {
  @Field(() => String)
  @IsString()
  message: string;

  @Field(() => NodeResponse)
  data: NodeResponse | null;
}
