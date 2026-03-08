

export interface RegisterDTO {
    email: string;
    password: string;
}

export type RegisterReturn = {
    verificationToken: string;
}