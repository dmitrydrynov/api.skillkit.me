import { constants, createWriteStream, promises } from 'fs';
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
        .pipe(createWriteStream(env.CONTAINER_STORAGE_DIR + targetPath))
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

export const removeFile = async (file: string) => {
  try {
    await promises.access(env.CONTAINER_STORAGE_DIR + file, constants.F_OK);
    await promises.unlink(env.CONTAINER_STORAGE_DIR + file);
  } catch (error) {
    console.error(error.message);
  }
};
