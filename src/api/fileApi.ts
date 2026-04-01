import { axiosPrivate, axiosPublic } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type { GetUploadUrlApiDTO, GetUploadUrlApiReturn } from "@/models/fileInterface";

export class FileApi {
    async getUploadPresignedUrl(data: GetUploadUrlApiDTO): Promise<[undefined, GetUploadUrlApiReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.post<FetchResponse<GetUploadUrlApiReturn>>(
            '/file/upload-presigned-url',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async uploadFile(url: string, file: File) {
        const [error] = await catchFetchError(axiosPublic.put(
            url,
            file,
            {
                headers: {
                    'Content-Type': file.type,
                },
            }
        ));

        if (error) return [error];
        return [error, true];
    }
}
