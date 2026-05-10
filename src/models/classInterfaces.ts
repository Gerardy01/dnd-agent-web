import type { WorkshopSpellReturn, Spell } from "@/models/spellInterfaces";

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

export type WorkshopClassDetailread = ClassRead & {
    resources: ClassResourceReturn[];
    spells: WorkshopSpellReturn[];
}

export type ClassDetailRead = ClassRead & {
    resources: ClassResourceReturn[];
    spells: Spell[];
}

export type WorkshopClassReturn = ClassRead & {
    workshopClassId: number;
    accountId: string;
}

export type WorkshopClassDetailReturn = WorkshopClassReturn & {
    resources: ClassResourceReturn[];
    spells: WorkshopSpellReturn[];
}

export interface AddFeaturePayload {
    workshopClassId: number;
    feature: Features;
}

export interface EditFeaturePayload {
    workshopClassId: number;
    currentFeature: Features;
    newFeature: Features;
}

export interface DeleteFeaturePayload {
    workshopClassId: number;
    feature: Features;
}

export interface AddResourcePayload {
    workshopClassId: number;
    resource: ClassResourceDTO;
}

export interface EditResourcePayload {
    workshopClassId: number;
    classResourceId: number;
    resource: ClassResourceDTO;
}

export interface DeleteResourcePayload {
    workshopClassId: number;
    classResourceId: number;
}

export type ClassResourceReturn = {
    id: number;
    image: string | null;
    name: string;
    description: string;
    color: string;
    maxPerLevel: MaxKnown[];
    resourceRecovery: ResourceRecovery;
}

export interface ClassSubBaseDTO {
    image?: string | null;
    name: string;
    description: string;
    spellcastingProperties: SpellcastingProperties | null;
    features: Features[];
    resources: ClassResourceDTO[];
    spellIds: number[];
}

export interface CreateClassSubDTO extends ClassSubBaseDTO {
    workshopClassId: number;
}

export interface WorkshopClassSubResourceDataReturn {
    id: number;
    workshopClassSubId: number;
    image: string | null;
    name: string;
    description: string;
    color: string;
    maxPerLevel: MaxKnown[];
    resourceRecovery: ResourceRecovery;
    createdAt?: Date;
}

export interface WorkshopClassSubDataReturn {
    id: number;
    workshopClassId: number;
    image: string | null;
    name: string;
    description: string;
    spellcastingProperties: SpellcastingProperties | null;
    features: Features[];
    createdAt?: Date;
}

export interface UpdateClassSubDTO extends ClassSubBaseDTO {
    id: number;
    isImageUpdated: boolean;
}

export interface WorkshopClassSubDetailDataReturn extends WorkshopClassSubDataReturn {
    resources: WorkshopClassSubResourceDataReturn[];
    spells: WorkshopSpellReturn[];
}
