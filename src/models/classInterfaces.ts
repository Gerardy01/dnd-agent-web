import type { WorkshopSpellReturn } from "@/models/spellInterfaces";

export interface MaxKnown {
    level: number;
    amount: number;
}

export interface SpellcastingProperties {
    spellcastingAbility: string;
    preparationType: string;
    spellcastingType: string;
    maxCantripKnown: MaxKnown[];
    maxSpellKnown: MaxKnown[];
    preparedLvlBonus: number;
    preparedModBonus: boolean;
}

export interface Features {
    name: string;
    description: string;
    level: number;
    type: string;
}

export interface ResourceRecoveryProps {
    value: number;
    type: string;
}

export interface ResourceRecovery {
    shortRest: ResourceRecoveryProps;
    longRest: ResourceRecoveryProps;
}

export interface ClassResourceDTO {
    image: string | null;
    name: string;
    description: string;
    color: string;
    maxPerLevel: MaxKnown[];
    resourceRecovery: ResourceRecovery;
}

export interface CreateClassDTO {
    image: string | null;
    name: string;
    description: string;
    hitDie: string;
    subclassLevel: number;
    spellcastingProperties: SpellcastingProperties | null;
    features: Features[];
    resources: ClassResourceDTO[];
    spellIds: number[];
}

export interface UpdateWorkshopClassDTO extends CreateClassDTO {
    workshopClassId: number;
    isImageUpdated: boolean;
}

export interface ClassWrite {
    image: string | null;
    name: string;
    description: string;
    hitDie: string;
    subclassLevel: number;
    spellcastingProperties: SpellcastingProperties | null;
    features: Features[];
    resources: ClassResourceDTO[];
    spellIds: number[];
}

export type ClassRead = {
    image: string | null;
    name: string;
    description: string;
    hitDie: string;
    subclassLevel: number;
    spellcastingProperties: SpellcastingProperties | null;
    features: Features[];
    createdAt: Date;
}

export type ClassDetailRead = ClassRead & {
    resources: ClassResourceDTO[];
    spells: WorkshopSpellReturn[];
}

export type WorkshopClassReturn = ClassRead & {
    workshopClassId: number;
    accountId: string;
}

export type WorkshopClassDetailReturn = WorkshopClassReturn & {
    resources: ClassResourceDTO[];
    spells: WorkshopSpellReturn[];
}
