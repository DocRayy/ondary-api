import { BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

export type UploadedPhoto = {
  filename: string;
  path: string;
  mimetype: string;
  originalname?: string;
  size?: number;
};

export type UploadedFile = UploadedPhoto;

const imageMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export function photoUploadOptions(folder: string) {
  const uploadDir = join(process.cwd(), 'storage', 'uploads', folder);

  return {
    storage: diskStorage({
      destination: (_request, _file, callback) => {
        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true });
        }

        callback(null, uploadDir);
      },
      filename: (_request, file, callback) => {
        const extension = extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${Math.round(
          Math.random() * 1_000_000_000,
        )}${extension}`;

        callback(null, uniqueName);
      },
    }),
    fileFilter: (_request, file, callback) => {
      if (!imageMimeTypes.has(file.mimetype)) {
        callback(
          new BadRequestException('Only image files are allowed'),
          false,
        );
        return;
      }

      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  };
}

export function fileUploadOptions(
  folder: string,
  maxFileSize = 10 * 1024 * 1024,
) {
  const uploadDir = join(process.cwd(), 'storage', 'uploads', folder);

  return {
    storage: diskStorage({
      destination: (_request, _file, callback) => {
        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true });
        }

        callback(null, uploadDir);
      },
      filename: (_request, file, callback) => {
        const extension = extname(file.originalname).toLowerCase();
        const uniqueName = `${Date.now()}-${Math.round(
          Math.random() * 1_000_000_000,
        )}${extension}`;

        callback(null, uniqueName);
      },
    }),
    limits: {
      fileSize: maxFileSize,
    },
  };
}

export function uploadedPhotoUrl(folder: string, file?: UploadedPhoto) {
  return file ? `uploads/${folder}/${file.filename}` : undefined;
}

export function uploadedPhotoPath(folder: string, file?: UploadedPhoto) {
  return file ? `storage/uploads/${folder}/${file.filename}` : undefined;
}

export function uploadedFileUrl(folder: string, file?: UploadedFile) {
  return uploadedPhotoUrl(folder, file);
}

export function uploadedFilePath(folder: string, file?: UploadedFile) {
  return uploadedPhotoPath(folder, file);
}
