import { constants, promises } from 'fs';
import path from 'path';
import { FastifyInstance } from 'fastify';
import { FileUpload, Upload } from 'graphql-upload';

export const uploadFile = async (app: FastifyInstance, file: FileUpload, dirName, fileName) => {
  const { nextcloud } = app;
  const { filename, createReadStream } = await file;

  const newFileName = fileName + path.extname(filename);
  const targetPath = '/cdn/skillkit/' + dirName;
  const newFilePath = targetPath + '/' + newFileName;

  const isStorageReady = await app.nextcloud.checkConnectivity();

  const stream = createReadStream();
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const buffer = Buffer.concat(chunks);

  console.log('Upload file is ready', isStorageReady);

  try {
    if (!(await nextcloud.exists(targetPath))) {
      await nextcloud.createFolderHierarchy(targetPath);
    }

    await nextcloud.put(newFilePath, buffer);
    const uploadedFile = await nextcloud.shares.get(newFilePath);

    return uploadedFile.url;
  } catch (error) {
    console.error(`File ${filename} didn't load`, error);

    return Promise.reject(error);
  }

  // try {
  //   const uploadingResponse = new Promise((resolve, reject) =>
  //     createReadStream()
  //       .pipe(createWriteStream('./storage/' + targetPath))
  //       .on('finish', () => resolve(true))
  //       .on('error', () => reject(false)),
  //   );

  //   if (await uploadingResponse) {
  //     return targetPath;
  //   }
  // } catch (error) {
  //   console.error(`File ${filename} didn't load`);

  //   return null;
  // }
};

export const removeFile = async (file: string) => {
  try {
    await promises.access('./storage/' + file, constants.F_OK);
    await promises.unlink('./storage/' + file);
  } catch (error) {
    console.error(error.message);
  }
};
