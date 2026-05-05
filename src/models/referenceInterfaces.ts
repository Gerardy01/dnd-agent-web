export interface ItemOptionsReturn {
    itemType: string[];
    gearCategories: string[];
    weaponCategories: string[];
    armorCategories: string[];
    itemRarity: string[];
    currencyUnit: string[];
    equipSlot: string[];
    itemBonusSelection: string[];
}

export interface EffectOptionsReturn {
    damageTypes: string[];
    immunities: string[];
}

export interface FeatOptionsReturn {
    featCategories: string[];
}

export interface SpellOptionsReturn {
    spellSchools: string[];
    savingThrowStats: string[];
}

export interface MonsterOptionsReturn {
    monsterSize: string[];
    monsterType: string[];
    alignment: string[];
    movementSelection: string[];
    sensesSelection: string[];
}

export type PresetMaxKnown = {
    name: string;
    maxCantripKnown: number[];
    maxSpellKnown: number[];
}

export interface ClassOptionsReturn {
    spellcastingAbility: string[];
    spellPreparationType: string[];
    spellcastingType: string[];
    diceSelection: string[];
    classFeatureType: string[];
    resourceRecoveryType: string[];
    presetMaxKnown: readonly PresetMaxKnown[];
}
