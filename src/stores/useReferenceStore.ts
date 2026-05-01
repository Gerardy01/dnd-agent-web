import { create } from "zustand";

// interfaces
import type { 
    ItemOptionsReturn, 
    EffectOptionsReturn, 
    FeatOptionsReturn, 
    SpellOptionsReturn,
    MonsterOptionsReturn 
} from "@/models/referenceInterfaces";

interface ReferenceState {
    itemOptions: ItemOptionsReturn;
    effectOptions: EffectOptionsReturn;
    featOptions: FeatOptionsReturn;
    spellOptions: SpellOptionsReturn;
    monsterOptions: MonsterOptionsReturn;
    setItemOptions: (itemOptions: ItemOptionsReturn) => void;
    setEffectOptions: (effectOptions: EffectOptionsReturn) => void;
    setFeatOptions: (featOptions: FeatOptionsReturn) => void;
    setSpellOptions: (spellOptions: SpellOptionsReturn) => void;
    setMonsterOptions: (monsterOptions: MonsterOptionsReturn) => void;
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
    setItemOptions: (itemOptions: ItemOptionsReturn) => set({ itemOptions }),
    setEffectOptions: (effectOptions: EffectOptionsReturn) => set({ effectOptions }),
    setFeatOptions: (featOptions: FeatOptionsReturn) => set({ featOptions }),
    setSpellOptions: (spellOptions: SpellOptionsReturn) => set({ spellOptions }),
    setMonsterOptions: (monsterOptions: MonsterOptionsReturn) => set({ monsterOptions }),
}));

export default useReferenceStore;