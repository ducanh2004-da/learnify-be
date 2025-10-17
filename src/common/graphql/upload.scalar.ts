import { GraphQLScalarType, GraphQLError } from 'graphql';

// Minimal Upload scalar compatible with graphql-upload's runtime behavior.
export const GraphQLUpload = new GraphQLScalarType({
  name: 'Upload',
  description: 'The `Upload` scalar type represents a file upload.',
  parseValue(value: any) {
    // The upload value should be a promise (graphql-multipart request).
    if (value && typeof value.then === 'function') return value;
    throw new GraphQLError('Upload value invalid.');
  },
  parseLiteral() {
    throw new GraphQLError('Upload literal unsupported.');
  },
  serialize() {
    throw new GraphQLError('Upload serialization unsupported.');
  },
});

export default GraphQLUpload;
