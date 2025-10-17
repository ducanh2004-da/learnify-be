import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { DocumentsService } from './document.service';
import { Document, UploadResponse, FileUpload } from '@/common/model/DTO/document/document.dto';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(private documentsService: DocumentsService) {}

  @Mutation(() => UploadResponse)
  async uploadDocument(
    // Use the Upload scalar at runtime so Nest can determine the input type.
    @Args({ name: 'file', type: () => GraphQLUpload }) file: Promise<FileUpload>,
    @Args('uploadedBy', { nullable: true }) uploadedBy?: string,
  ) {
    // GraphQL upload field resolves to a Promise<FileUpload>
    const uploaded = await file;
    return this.documentsService.uploadDocument(uploaded, uploadedBy);
  }

  @Query(() => [Document])
  async getAllDocuments() {
    return this.documentsService.getAllDocuments();
  }

  @Query(() => Document, { nullable: true })
  async getDocumentById(@Args('id') id: string) {
    return this.documentsService.getDocumentById(id);
  }

  @Mutation(() => UploadResponse)
  async deleteDocument(@Args('id') id: string) {
    return this.documentsService.deleteDocument(id);
  }
}