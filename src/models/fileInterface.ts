


export interface GetUploadUrlApiDTO {
    fileType: string;
    fileSize: number;
}

export interface ImageFormRef {
    reset: () => void;
}

export interface GetUploadUrlApiReturn {
    url: string;
    key: string;
}