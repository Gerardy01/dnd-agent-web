
export interface CreateFactionDTO {
    image: string | null;
    name: string;
    description: string;
    color: string;
}

export interface UpdateWorkshopFactionDTO extends CreateFactionDTO {
    workshopFactionId: number;
    isImageUpdated: boolean;
}

export type Faction = {
    image: string | null;
    name: string;
    description: string;
    color: string;
    createdAt: Date;
}

export type WorkshopFactionReturn = Faction & {
    workshopFactionId: number;
    accountId: string;
}
