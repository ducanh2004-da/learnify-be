// src/ai/dto/ai-response.object.ts
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AiContentItem {
  @Field()
  url_pdf: string;

  @Field()
  content: string;
}

@ObjectType()
export class AiLessonResponse {
  @Field()
  lesson_id: string;

  @Field(() => [AiContentItem])
  content: AiContentItem[];
}
