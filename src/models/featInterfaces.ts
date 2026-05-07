export interface CreateFeatDTO {
    image: string | null;
    name: string;
    description: string;
    category: string;
    minLevel: number | null;
}

export interface UpdateWorkshopFeatDTO extends CreateFeatDTO {
    workshopFeatId: number;
    isImageUpdated: boolean;
}

export type Feat = {
    image: string | null;
    name: string;
    description: string;
    category: string;
    minLevel: number | null;
    createdAt: Date;
}

export type WorkshopFeatReturn = Feat & {
    workshopFeatId: number;
    accountId: string;
}
