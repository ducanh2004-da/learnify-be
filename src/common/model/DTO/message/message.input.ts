import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Field(() => String)
  @IsString()
  content: string;

  @Field(() => String)
  @IsUUID()
  conversationId: string;

  @Field(() => String)
  courseId: string;

  @Field(() => String)
  lessonId: string;
}

@InputType()
export class UpdateMessageInput {
  @Field(() => String)
  @IsUUID()
  id: string;

  @Field(() => String)
  @IsString()
  content: string;
}

@InputType()
export class CreateMessage2Input {
  @Field(() => String, { nullable: true })
  @IsString()
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
