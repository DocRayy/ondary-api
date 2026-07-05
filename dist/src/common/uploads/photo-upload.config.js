"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photoUploadOptions = photoUploadOptions;
exports.fileUploadOptions = fileUploadOptions;
exports.uploadedPhotoUrl = uploadedPhotoUrl;
exports.uploadedPhotoPath = uploadedPhotoPath;
exports.uploadedFileUrl = uploadedFileUrl;
exports.uploadedFilePath = uploadedFilePath;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const multer_1 = require("multer");
const imageMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
]);
function photoUploadOptions(folder) {
    const uploadDir = (0, path_1.join)(process.cwd(), 'storage', 'uploads', folder);
    return {
        storage: (0, multer_1.diskStorage)({
            destination: (_request, _file, callback) => {
                if (!(0, fs_1.existsSync)(uploadDir)) {
                    (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
                }
                callback(null, uploadDir);
            },
            filename: (_request, file, callback) => {
                const extension = (0, path_1.extname)(file.originalname).toLowerCase();
                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1_000_000_000)}${extension}`;
                callback(null, uniqueName);
            },
        }),
        fileFilter: (_request, file, callback) => {
            if (!imageMimeTypes.has(file.mimetype)) {
                callback(new common_1.BadRequestException('Only image files are allowed'), false);
                return;
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    };
}
function fileUploadOptions(folder, maxFileSize = 10 * 1024 * 1024) {
    const uploadDir = (0, path_1.join)(process.cwd(), 'storage', 'uploads', folder);
    return {
        storage: (0, multer_1.diskStorage)({
            destination: (_request, _file, callback) => {
                if (!(0, fs_1.existsSync)(uploadDir)) {
                    (0, fs_1.mkdirSync)(uploadDir, { recursive: true });
                }
                callback(null, uploadDir);
            },
            filename: (_request, file, callback) => {
                const extension = (0, path_1.extname)(file.originalname).toLowerCase();
                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1_000_000_000)}${extension}`;
                callback(null, uniqueName);
            },
        }),
        limits: {
            fileSize: maxFileSize,
        },
    };
}
function uploadedPhotoUrl(folder, file) {
    return file ? `uploads/${folder}/${file.filename}` : undefined;
}
function uploadedPhotoPath(folder, file) {
    return file ? `storage/uploads/${folder}/${file.filename}` : undefined;
}
function uploadedFileUrl(folder, file) {
    return uploadedPhotoUrl(folder, file);
}
function uploadedFilePath(folder, file) {
    return uploadedPhotoPath(folder, file);
}
//# sourceMappingURL=photo-upload.config.js.map