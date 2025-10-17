import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';
import { NoteReturn } from './noteReturn.dto';

@ObjectType()
export class NoteResponse {
    @Field(() => String)
    @IsString()
    message: string;

    @Field(() => NoteReturn, { nullable: true })
    data?: NoteReturn | null;
}
