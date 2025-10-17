import { ObjectType, Field, Int } from '@nestjs/graphql';
// import { GraphQLUpload } from 'graphql-upload';
// import { GraphQLUpload } from 'apollo-server-express';

// Define FileUpload type manually
export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

@ObjectType()
export class Document {
  @Field()
  id: string;

  @Field()
  fileName: string;

  @Field()
  fileUrl: string;

  @Field()
  fileType: string;

  @Field(() => Int)
  fileSize: number;

  @Field()
  publicId: string;

  @Field({ nullable: true })
  uploadedBy?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class UploadResponse {
  @Field()
  success: boolean;

  @Field(() => Document, { nullable: true })
  document?: Document;
}
