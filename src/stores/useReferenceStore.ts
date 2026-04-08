import { create } from "zustand";

// interfaces
import type { ItemOptionsReturn, EffectOptionsReturn, FeatOptionsReturn } from "@/models/referenceInterfaces";

interface ReferenceState {
    itemOptions: ItemOptionsReturn;
    effectOptions: EffectOptionsReturn;
    featOptions: FeatOptionsReturn;
    setItemOptions: (itemOptions: ItemOptionsReturn) => void;
    setEffectOptions: (effectOptions: EffectOptionsReturn) => void;
    setFeatOptions: (featOptions: FeatOptionsReturn) => void;
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
    setItemOptions: (itemOptions: ItemOptionsReturn) => set({ itemOptions }),
    setEffectOptions: (effectOptions: EffectOptionsReturn) => set({ effectOptions }),
    setFeatOptions: (featOptions: FeatOptionsReturn) => set({ featOptions }),
}));

export default useReferenceStore;