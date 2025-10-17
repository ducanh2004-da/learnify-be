import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional } from 'class-validator';

@InputType()
export class CreateNodeInput {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String)
  @IsOptional()
  @IsString()
  description: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  mindMapId?: string | null;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  order?: number | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  parentId?: string | null;
}

@InputType()
export class UpdateNodeInput {
  @Field(() => String)
  @IsString()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  order?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  mindMapId?: string;
}

