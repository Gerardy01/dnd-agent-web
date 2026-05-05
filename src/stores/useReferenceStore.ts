import { create } from "zustand";

// interfaces
import type {
    ItemOptionsReturn,
    EffectOptionsReturn,
    FeatOptionsReturn,
    SpellOptionsReturn,
    MonsterOptionsReturn,
    ClassOptionsReturn
} from "@/models/referenceInterfaces";

interface ReferenceState {
    itemOptions: ItemOptionsReturn;
    effectOptions: EffectOptionsReturn;
    featOptions: FeatOptionsReturn;
    spellOptions: SpellOptionsReturn;
    monsterOptions: MonsterOptionsReturn;
    classOptions: ClassOptionsReturn;
    setItemOptions: (itemOptions: ItemOptionsReturn) => void;
    setEffectOptions: (effectOptions: EffectOptionsReturn) => void;
    setFeatOptions: (featOptions: FeatOptionsReturn) => void;
    setSpellOptions: (spellOptions: SpellOptionsReturn) => void;
    setMonsterOptions: (monsterOptions: MonsterOptionsReturn) => void;
    setClassOptions: (classOptions: ClassOptionsReturn) => void;
}

const useReferenceStore = create<ReferenceState>((set) => ({
    itemOptions: {
        itemType: [],
        gearCategories: [],
        weaponCategories: [],
        armorCategories: [],
        itemRarity: [],
        currencyUnit: [],
        equipSlot: [],
        itemBonusSelection: [],
    },
    effectOptions: {
        damageTypes: [],
        immunities: [],
    },
    featOptions: {
        featCategories: [],
    },
    spellOptions: {
        spellSchools: [],
        savingThrowStats: [],
    },
    monsterOptions: {
        monsterSize: [],
        monsterType: [],
        alignment: [],
        movementSelection: [],
        sensesSelection: [],
    },
    classOptions: {
        spellcastingAbility: [],
        spellPreparationType: [],
        spellcastingType: [],
        diceSelection: [],
        classFeatureType: [],
        resourceRecoveryType: [],
        presetMaxKnown: [],
    },
    setItemOptions: (itemOptions: ItemOptionsReturn) => set({ itemOptions }),
    setEffectOptions: (effectOptions: EffectOptionsReturn) => set({ effectOptions }),
    setFeatOptions: (featOptions: FeatOptionsReturn) => set({ featOptions }),
    setSpellOptions: (spellOptions: SpellOptionsReturn) => set({ spellOptions }),
    setMonsterOptions: (monsterOptions: MonsterOptionsReturn) => set({ monsterOptions }),
    setClassOptions: (classOptions: ClassOptionsReturn) => set({ classOptions }),
}));

export default useReferenceStore;