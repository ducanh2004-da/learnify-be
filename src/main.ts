import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  // Use default Express adapter to allow graphql-upload middleware
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 10000;
  const address = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

  app.enableCors();

  // Dynamically import the ESM middleware entrypoint for graphql-upload and apply it
  try {
    const mod: any = await import('graphql-upload/graphqlUploadExpress.mjs');
    const graphqlUploadExpress = mod.graphqlUploadExpress ?? mod.default ?? mod;
    if (typeof graphqlUploadExpress === 'function') {
      // apply before GraphQL handling so multipart/form-data is parsed correctly
      app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 10 }));
    } else {
      console.warn('graphqlUploadExpress middleware not found; file uploads may not work.');
    }
  } catch (err) {
    console.warn('Could not load graphql-upload middleware dynamically:', err);
  }

  await app.listen(port, address);
  console.log(`Server listening at ${address} on port ${port}`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
