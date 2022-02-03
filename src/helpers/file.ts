import { createWriteStream, promises } from 'fs';
import path from 'path';
import { env } from '@config/env';
import { FileUpload } from 'graphql-upload';

export const uploadFile = async (uploadPromise, dirName, fileName) => {
  const uploadData = await uploadPromise;
  const { filename, createReadStream } = uploadData as unknown as FileUpload;
  const targetPath = `/${dirName}/${fileName}${path.extname(filename)}`;

  try {
    const uploadingResponse = new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(env.FILE_STORAGE_DIR + targetPath))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );

    if (await uploadingResponse) {
      return targetPath;
    }
  } catch (error) {
    console.error(`File ${filename} didn't load`);

    return null;
  }
};

export const removeFile = async (file) => {
  await promises.unlink(env.FILE_STORAGE_DIR + file);
};
