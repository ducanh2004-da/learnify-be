import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNumber, IsOptional, MinLength, IsString, Length } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field(() => String)
  @Length(3,50, {message: 'username must between 3 to 50 character'})
  @IsString({ message: 'user name must be string' })
  username: string;

  @Field(() => String)
  @IsOptional()
  @IsString({ message: 'phone number must be string' })
  phoneNumber?: string;

  @Field(() => String)
  @IsEmail({}, {message: 'email is invalid'})
  email: string;

  @Field(() => String)
  @Length(5, 100, {message: 'Password must at least 5 character'})
  @IsString({ message: 'password must be string' })
  password: string;
}

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsEmail({}, {message: 'email is invalid'})
  email: string;

  @Field(() => String)
  @Length(5, 100, {message: 'Password must at least 5 character'})
  @IsString({ message: 'password must be string' })
  password: string;
}

@InputType()
export class GoogleLoginInput {
  @Field(() => String)
  @IsEmail({}, { message: 'email is invalid' })
  googleId: string;

  @Field(() => String)
  email: string;
}

