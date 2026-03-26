import { create } from "zustand";

// interfaces
import type { ItemOptionsReturn, EffectOptionsReturn } from "@/models/referenceInterfaces";

interface ReferenceState {
    itemOptions: ItemOptionsReturn;
    effectOptions: EffectOptionsReturn;
    setItemOptions: (itemOptions: ItemOptionsReturn) => void;
    setEffectOptions: (effectOptions: EffectOptionsReturn) => void;
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
    setItemOptions: (itemOptions: ItemOptionsReturn) => set({ itemOptions }),
    setEffectOptions: (effectOptions: EffectOptionsReturn) => set({ effectOptions }),
}));

export default useReferenceStore;