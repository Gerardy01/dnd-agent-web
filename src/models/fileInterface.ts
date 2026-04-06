


export interface GetUploadUrlApiDTO {
    fileType: string;
    fileSize: number;
}

export interface GetUploadUrlApiReturn {
    url: string;
    key: string;
}