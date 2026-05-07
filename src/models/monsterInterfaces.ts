

export type MonsterSpeed = {
    walk: number;
    burrow: number;
    climb: number;
    fly: number;
    swim: number;
}

export type MonsterSenses = {
    blindsight: number;
    darkvision: number;
    tremorsense: number;
    truesight: number;
}

export type MonsterStats = {
    minHp: number;
    maxHp: number;
    ac: number;
    cr: number;
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export type AdditionalProperties = {
    immunities: string[];
    resistances: string[];
    vulnerabilities: string[];
    conditionImmunities: string[];
}

export type MonsterAction = {
    name: string;
    description: string;
}

export interface CreateMonsterDTO {
    image: string | null;
    name: string;
    alignment: string;
    size: string;
    type: string;
    description: string;
    appearance: string;
    languages?: string | null;
    speed: MonsterSpeed;
    senses: MonsterSenses;
    stats: MonsterStats;
    additionalProperties?: AdditionalProperties | null;
    actions?: MonsterAction[] | null;
}

export interface UpdateWorkshopMonsterDTO extends CreateMonsterDTO {
    workshopMonsterId: number;
    isImageUpdated: boolean;
}

export type Monster = {
    image: string | null;
    name: string;
    alignment: string;
    size: string;
    type: string;
    description: string;
    appearance: string;
    languages: string | null;
    speed: MonsterSpeed;
    senses: MonsterSenses;
    stats: MonsterStats;
    additionalProperties: AdditionalProperties | null;
    actions: MonsterAction[] | null;
    createdAt: Date;
}

export type WorkshopMonsterReturn = Monster & {
    workshopMonsterId: number;
    accountId: string;
}
