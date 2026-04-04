export type DamageRoll = {
    count: number;
    dice: number;
    bonus: number;
    damageType: string;
}

export type WeaponProperties = {
    damageRoll: DamageRoll[];
    light: boolean;
    heavy: boolean;
    finesse: boolean;
    thrown: boolean;
    twoHanded: boolean;
    range: {
        normal: number;
        long: number | null;
    } | null;
    versatileDamageRoll: DamageRoll | null;
    ammunition: boolean;
    loading: boolean;
    reach: boolean;
}

export type ArmorProperties = {
    baseAc: number;
    strengthReq: number;
    modifier: {
        dexMod: boolean;
        conMod: boolean;
        wisMod: boolean;
    };
    flatAcBonus: number;
    maxModifier: number;
    other: {
        stealthDisadvantage: boolean;
    }
}

export type AdditionalProperties = {
    immunities: string[];
    resistances: string[];
    vulnerabilities: string[];
    conditionImmunities: string[];
}

export type ItemBonus = {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    ac: number;
    speed: number;
    hp: number;
}

export type ModifierBonus = {
    from: string;
    to: string;
    value: number;
}

export interface CreateItemDTO {
    image?: string;
    name: string;
    type: string;
    description: string;
    appearance: string;
    category: string;
    rarity: string;
    isMagicItem: boolean;
    weight: number;
    cost: number;
    currencyUnit: string;
    equipSlot?: string | null;
    weaponProperties?: WeaponProperties | null;
    armorProperties?: ArmorProperties | null;
    additionalProperties?: AdditionalProperties | null;
    flatBonus?: ItemBonus | null;
    overrideBonus?: ItemBonus | null;
    modifierBonus?: ModifierBonus[] | null;
}

export interface UpdateWorkshopItemDTO extends CreateItemDTO {
    workshopItemId: number;
}

export type Item = {
    workshopItemId: number;
    image: string | null;
    name: string;
    type: string;
    description: string;
    appearance: string;
    category: string;
    rarity: string;
    isMagicItem: boolean;
    weight: number;
    cost: number;
    currencyUnit: string;
    equipSlot: string | null;
    weaponProperties: WeaponProperties | null;
    armorProperties: ArmorProperties | null;
    additionalProperties: AdditionalProperties | null;
    flatBonus: ItemBonus | null;
    overrideBonus: ItemBonus | null;
    modifierBonus: ModifierBonus[] | null;
    createdAt: Date;
}

export type WorkshopItemReturn = Item & {
    accountId: string;
}
