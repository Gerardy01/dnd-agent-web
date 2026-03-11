import { axiosPublic } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type { ForgotPasswordReturn, RegisterDTO, RegisterReturn, ResetPasswordDTO } from "@/models/accountInterfaces";



export class AccountApi {
    async register(data: RegisterDTO): Promise<[undefined, RegisterReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPublic.post<FetchResponse<RegisterReturn>>(
            '/account/action/register',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async forgotPasswordRequest(email: string): Promise<[undefined, ForgotPasswordReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPublic.post<FetchResponse<ForgotPasswordReturn>>(
            '/account/action/forgot-password',
            { email },
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async resetPassword(data: ResetPasswordDTO): Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPublic.put<FetchResponse<boolean>>(
            '/account/action/reset-password',
            data
        ));

        if (error) return [error];
        return [error, true];
    }
}