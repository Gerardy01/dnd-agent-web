import { axiosPublic } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type { LoginReturn, LoginDTO, GetAccessTokenReturn } from "@/models/authInterfaces";



export class AuthApi {
    async login(data: LoginDTO): Promise<[undefined, LoginReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPublic.post<FetchResponse<LoginReturn>>(
            '/login',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async getAccessToken(): Promise<[undefined, GetAccessTokenReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPublic.get<FetchResponse<GetAccessTokenReturn>>(
            '/token',
            {
                withCredentials: true,
            }
        ));

        if (error) return [error];
        return [error, res.data.data]
    }
}