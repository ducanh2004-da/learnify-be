import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

@ObjectType()
export class NodeResponse {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsOptional()
  @IsString()
  description?: string | null;

  @Field(() => Number)
  @IsOptional()
  order?: number | null;

  @Field(() => [NodeResponse], {nullable: 'itemsAndList'})
  children?: NodeResponse[] | null;
}
