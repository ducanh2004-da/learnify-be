import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@ObjectType()
export class UserResponse {
  @Field()
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true }) 
  phoneNumber?: string;

  @Field(() => String, { nullable: true }) 
  avatar?: string | null;

  @Field()
  role: Role; 

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
