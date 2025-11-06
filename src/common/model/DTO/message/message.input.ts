import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID, Min, MinLength } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field(() => String)
  @IsString({ message: 'content must be string' })
  @MinLength(1, { message: 'content must at least 1 character' })
  content: string;

  @Field(() => String)
  @IsUUID()
  conversationId: string;

  @Field(() => String)
  @IsString({ message: 'courseId must be string' })
  courseId: string;

  @Field(() => String)
  @IsString({ message: 'lessonId must be string' })
  lessonId: string;
}

@InputType()
export class UpdateMessageInput {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsString({ message: 'content must be string' })
  @MinLength(1, { message: 'content must at least 1 character' })
  content: string;
}

@InputType()
export class CreateMessage2Input {
  @Field(() => String, { nullable: true })
  @IsString({ message: 'question must be string' })
  question: string;

  @Field(() => String, { nullable: true })
  user_id?: string;

  @Field(() => String, { nullable: true })
  lesson_id?: string = "8e10155a-6601-4eda-90ac-e7ab3a2fb54b";

  @Field(() => String, { nullable: true })
  messages?: string | null;

  @Field(() => String)
  @IsUUID()
  conversationId: string;
}
