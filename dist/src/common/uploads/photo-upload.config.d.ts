export type UploadedPhoto = {
    filename: string;
    path: string;
    mimetype: string;
    originalname?: string;
    size?: number;
};
export type UploadedFile = UploadedPhoto;
export declare function photoUploadOptions(folder: string): {
    storage: any;
    fileFilter: (_request: any, file: any, callback: any) => void;
    limits: {
        fileSize: number;
    };
};
export declare function fileUploadOptions(folder: string, maxFileSize?: number): {
    storage: any;
    limits: {
        fileSize: number;
    };
};
export declare function uploadedPhotoUrl(folder: string, file?: UploadedPhoto): string | undefined;
export declare function uploadedPhotoPath(folder: string, file?: UploadedPhoto): string | undefined;
export declare function uploadedFileUrl(folder: string, file?: UploadedFile): string | undefined;
export declare function uploadedFilePath(folder: string, file?: UploadedFile): string | undefined;
