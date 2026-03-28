


export const SettingsMenuEnum = {
    PROFILE: "profile",
    PREFERENCES: "preferences",
    ACCOUNT: "account",
} as const;

export const SidebarMenuEnum = {
    DASHBOARD: "dashboard",
    CAMPAIGNS: "campaigns",
    WORKSHOP: "workshop",
} as const;

export const WorkshopMenuEnum = {
    WORLDS: "worlds",
    CHARACTERS: "characters",
    RACES: "races",
    CLASSES: "classes",
    FACTIONS: "factions",
    MONSTERS: "monsters",
    ITEMS: "items",
    SPELLS: "spells",
    FEATS: "feats",
} as const;

export const SortEnum = {
    RECENT: "recent",
    ASC: "asc",
    DESC: "desc",
} as const;

export const RarityEnum = {
    COMMON: "common",
    UNCOMMON: "uncommon",
    RARE: "rare",
    VERY_RARE: "very_rare",
    LEGENDARY: "legendary",
    ARTIFACT: "artifact",
} as const;

export const ItemTypeEnum = {
    GEAR: "gear",
    WEAPON: "weapon",
    ARMOR: "armor",
} as const;

export const CurrencyUnitEnum = {
    COPPER: "copper",
    SILVER: "silver",
    ELECTRUM: "electrum",
    GOLD: "gold",
    PLATINUM: "platinum",
} as const;

export const DamageTypeEnum = {
    ACID: "acid",
    BLUDGEONING: "bludgeoning",
    COLD: "cold",
    FIRE: "fire",
    FORCE: "force",
    LIGHTNING: "lightning",
    NECROTIC: "necrotic",
    PIERCING: "piercing",
    POISON: "poison",
    PSYCHIC: "psychic",
    RADIANT: "radiant",
    SLASHING: "slashing",
    THUNDER: "thunder",
} as const;