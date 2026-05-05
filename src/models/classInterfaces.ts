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

export interface CreateClassResourceDTO {
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
    resources: CreateClassResourceDTO[];
    spellIds: number[];
}

export interface WorkshopClassReturn {
    workshopClassId: number;
    accountId: string;
    image: string | null;
    name: string;
    description: string;
    hitDie: string;
    subclassLevel: number;
    spellcastingProperties: SpellcastingProperties | null;
    features: Features[];
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkshopClassDetailReturn extends WorkshopClassReturn {
    resources: CreateClassResourceDTO[];
    spellIds: number[];
}

export interface UpdateWorkshopClassDTO extends CreateClassDTO {
    workshopClassId: number;
    isImageUpdated: boolean;
}
