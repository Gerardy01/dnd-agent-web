

export interface RegisterDTO {
    email: string;
    password: string;
}

export interface ResetPasswordDTO {
    token: string;
    newPassword: string;
}

export type RegisterReturn = {
    verificationToken: string;
}

export type ForgotPasswordReturn = {
    verificationToken: string;
}