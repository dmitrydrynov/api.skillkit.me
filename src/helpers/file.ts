import path, { basename } from 'path';
import { FastifyInstance } from 'fastify';
import { FileUpload } from 'graphql-upload';

export const uploadFile = async (app: FastifyInstance, file: FileUpload, dirName, fileName) => {
  const { sanity } = app;
  const { filename, createReadStream } = await file;
  const newFileName = fileName + path.extname(filename);
  const stream = createReadStream();
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  try {
    const response = await sanity.assets.upload('image', buffer, {
      filename: newFileName,
    });

    return response.url;
  } catch (error) {
    console.error(`File ${filename} didn't load`, error);

    return Promise.reject(error);
  }
};

export const removeFile = async (app: FastifyInstance, filePath: string) => {
  try {
    const response = await app.sanity.delete(basename(filePath));

    console.log('[Remove File]', response);

    return Promise.resolve();
  } catch (error) {
    console.error(error.message);
  }
};
