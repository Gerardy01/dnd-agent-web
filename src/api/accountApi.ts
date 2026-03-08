import { axiosPublic } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type { RegisterDTO, RegisterReturn } from "@/models/accountInterfaces";



export class AccountApi {
    async register(data: RegisterDTO): Promise<[undefined, RegisterReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPublic.post<FetchResponse<RegisterReturn>>(
            '/account/register',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}