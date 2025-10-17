import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNumber, IsOptional, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @MinLength(3)
  username: string;

  @Field()
  @IsOptional()
  phoneNumber?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class GoogleLoginInput {
  @Field()
  googleId: string;

  @Field()
  email: string;
}

