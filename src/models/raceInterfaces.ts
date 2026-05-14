import type { WorkshopSpellReturn, Spell } from "@/models/spellInterfaces";

export interface MaxKnown {
    level: number;
    amount: number;
}

export interface SpellcastingProperties {
    spellcastingAbility: string;
}

export interface Traits {
    name: string;
    description: string;
    level: number;
    type: string;
}



export interface RaceWrite {
    image: string | null;
    name: string;
    description: string;
    speed: number;
    language: string;
    spellcastingProperties: SpellcastingProperties | null;
    traits: Traits[];
    spellIds: number[];
}

export interface UpdateWorkshopRaceDTO extends RaceWrite {
    workshopRaceId: number;
    isImageUpdated: boolean;
}

export type RaceRead = {
    image: string | null;
    name: string;
    description: string;
    speed: number;
    language: string;
    spellcastingProperties: SpellcastingProperties | null;
    traits: Traits[];
    createdAt?: Date;
}


export type WorkshopRaceReturn = RaceRead & {
    workshopRaceId: number;
    accountId: string;
}

export type WorkshopRaceDetailReturn = WorkshopRaceReturn & {

    spells: WorkshopSpellReturn[];
}

export type RaceDetailRead = RaceRead & {

    spells: Spell[];
}

export interface AddTraitPayload {
    workshopRaceId: number;
    trait: Traits;
}

export interface EditTraitPayload {
    workshopRaceId: number;
    currentTrait: Traits;
    newTrait: Traits;
}

export interface DeleteTraitPayload {
    workshopRaceId: number;
    trait: Traits;
}


