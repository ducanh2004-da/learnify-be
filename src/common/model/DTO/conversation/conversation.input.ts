import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateConversationInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 80, {message: 'name must between 1 to 100 character'})
  @IsString({message: 'name must be string'})
  name?: string;

  @Field(() => String)
  @IsString({message: 'creator id must be string'})
  creatorId: string;
}

@InputType()
export class UpdateConversationInput {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 80, {message: 'name must between 1 to 100 character'})
  @IsString()
  name?: string;
}
