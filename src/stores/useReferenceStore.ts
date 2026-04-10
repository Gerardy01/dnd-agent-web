import { create } from "zustand";

// interfaces
import type { ItemOptionsReturn, EffectOptionsReturn, FeatOptionsReturn, SpellOptionsReturn } from "@/models/referenceInterfaces";

interface ReferenceState {
    itemOptions: ItemOptionsReturn;
    effectOptions: EffectOptionsReturn;
    featOptions: FeatOptionsReturn;
    spellOptions: SpellOptionsReturn;
    setItemOptions: (itemOptions: ItemOptionsReturn) => void;
    setEffectOptions: (effectOptions: EffectOptionsReturn) => void;
    setFeatOptions: (featOptions: FeatOptionsReturn) => void;
    setSpellOptions: (spellOptions: SpellOptionsReturn) => void;
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
    setItemOptions: (itemOptions: ItemOptionsReturn) => set({ itemOptions }),
    setEffectOptions: (effectOptions: EffectOptionsReturn) => set({ effectOptions }),
    setFeatOptions: (featOptions: FeatOptionsReturn) => set({ featOptions }),
    setSpellOptions: (spellOptions: SpellOptionsReturn) => set({ spellOptions }),
}));

export default useReferenceStore;