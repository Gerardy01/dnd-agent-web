

export interface RegisterDTO {
    email: string;
    password: string;
}

export interface ResetPasswordDTO {
    token: string;
    newPassword: string;
}

export interface AccountStateDTO {
    accountId: string;
    username: string;
    email: string;
}

export type RegisterReturn = {
    verificationToken: string;
}

export type ForgotPasswordReturn = {
    verificationToken: string;
}

export type AccountReturn = {
    accountId: string;
    username: string;
    email: string;
}