

export interface LoginDTO {
    identifier: string;
    password: string;
}

export interface VerifyOtpDTO {
    token: string;
    code: number;
}

export type LoginReturn = {
    verificationToken: string;
}

export type GetAccessTokenReturn = {
    accessToken: string;
}

export type verifyOtpReturn = {
    accessToken: string;
}