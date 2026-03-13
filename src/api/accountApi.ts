import { axiosPrivate, axiosPublic } from "@/config/axiosConfig";

// utils
import { catchFetchError } from "@/utils/utility";

// interfaces
import type { FetchResponse, ErrorResponse } from "@/models/globalInterfaces";
import type {
    AccountReturn,
    RegisterDTO,
    RegisterReturn,
    ResetPasswordDTO
} from "@/models/accountInterfaces";



export class AccountApi {
    async getUserAccoount(): Promise<[undefined, AccountReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.get<FetchResponse<AccountReturn>>(
            '/account/action/user',
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async register(data: RegisterDTO): Promise<[undefined, RegisterReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPublic.post<FetchResponse<RegisterReturn>>(
            '/account/action/register',
            data,
        ));

        if (error) return [error];
        return [error, res.data.data];
    }

    async forgotPasswordRequest(email: string): Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPublic.post<FetchResponse<boolean>>(
            '/account/action/forgot-password',
            { email },
        ));

        if (error) return [error];
        return [error, true];
    }

    async resetPassword(data: ResetPasswordDTO): Promise<[undefined, boolean] | [ErrorResponse]> {
        const [error] = await catchFetchError(axiosPublic.put<FetchResponse<boolean>>(
            '/account/action/reset-password',
            data
        ));

        if (error) return [error];
        return [error, true];
    }

    async changeUsername(newUsername: string): Promise<[undefined, AccountReturn] | [ErrorResponse]> {
        const [error, res] = await catchFetchError(axiosPrivate.put<FetchResponse<AccountReturn>>(
            '/account/action/change-username',
            { username: newUsername }
        ));

        if (error) return [error];
        return [error, res.data.data];
    }
}