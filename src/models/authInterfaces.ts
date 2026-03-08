

export interface LoginDTO {
    identifier: string;
    password: string;
}

export type LoginReturn = {
    verificationToken: string;
}

export type GetAccessTokenReturn = {
    accessToken: string;
}