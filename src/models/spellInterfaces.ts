export type DamageRoll = {
    count: number;
    dice: number;
    bonus: number;
    damageType: string;
}

export type AttackProperties = {
    requiresRangedAttackRoll: boolean;
    damageRoll: DamageRoll[];
}

export type SpellSaveProperties = {
    stat: string;
    onSuccessDamagePercentage: number;
    onFailDamagePercentage: number;
}

export interface CreateSpellDTO {
    image?: string;
    name: string;
    description: string;
    level: number;
    range: number;
    school: string;
    attackProperties?: AttackProperties | null;
    spellSaveProperties?: SpellSaveProperties | null;
}

export interface UpdateWorkshopSpellDTO {
    workshopSpellId: number;
    image?: string;
    isImageUpdated: boolean;
    name: string;
    description: string;
    level: number;
    range: number;
    school: string;
    attackProperties?: AttackProperties | null;
    spellSaveProperties?: SpellSaveProperties | null;
}

export type WorkshopSpellReturn = {
    workshopSpellId: number;
    accountId: string;
    image: string | null;
    name: string;
    description: string;
    level: number;
    range: number;
    school: string;
    attackProperties: AttackProperties | null;
    spellSaveProperties: SpellSaveProperties | null;
    createdAt: Date;
}
