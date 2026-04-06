import { useEffect, useState } from "react";
import { Form, type FormProps } from "antd";

// utils
import { DamageTypeEnum, ItemTypeEnum, WeaponToggleEnum } from "@/utils/enums";

// constants
import { DICE_SELECTION } from "@/constants/selections";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// hooks
import { useTranslation } from "react-i18next";

// interfaces
import type { Item } from "@/models/itemInterfaces";
interface EditItemFormValues {
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
    equipSlot?: string;
    immunities: string[];
    resistances: string[];
    vulnerabilities: string[];
    conditionImmunities: string[];
    normalRange?: number;
    longRange?: number;
    baseAc?: number;
    strengthReq?: number;
    dexMod?: boolean;
    conMod?: boolean;
    wisMod?: boolean;
    flatAcBonus?: number;
    maxModifier?: number;
    stealthDisadvantage?: boolean;
}
interface Bonus {
    stats: string;
    value: number;
}
interface ModBonus {
    from: string;
    to: string;
    value: number;
}
interface DamageRoll {
    count: number;
    dice: number;
    bonus: number;
    damageType: string;
}
interface WeaponToggle {
    light: boolean;
    heavy: boolean;
    finesse: boolean;
    thrown: boolean;
    twoHanded: boolean;
    range: boolean;
    versatile: boolean;
    ammunition: boolean;
    loading: boolean;
    reach: boolean;
}

export default function useEditItem(
    onClose: () => void,
    onEditSubmit: (item: Item, prevData: Item) => Promise<void>,
    getData: () => Promise<Item | null>
) {
    const { t } = useTranslation();

    const { itemOptions, effectOptions } = useReferenceStore();

    const [editItemForm] = Form.useForm();

    const [item, setItem] = useState<Item | null>(null);

    const [submitLoad, setSubmitLoad] = useState<boolean>(false);

    const [imageUrl, setImageUrl] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>(ItemTypeEnum.GEAR);
    const [isMagicItem, setIsMagicItem] = useState<boolean>(false);
    const [equipSlotValue, setEquipSlotValue] = useState<string>("");
    const [flatBonusEnabled, setFlatBonusEnabled] = useState<boolean>(false);
    const [overrideBonusEnabled, setOverrideBonusEnabled] = useState<boolean>(false);
    const [modifierBonusEnabled, setModifierBonusEnabled] = useState<boolean>(false);

    const [flatBonusValue, setFlatBonusValue] = useState<Bonus[]>([]);
    const [overrideBonusValue, setOverrideBonusValue] = useState<Bonus[]>([]);
    const [modifierBonusValue, setModifierBonusValue] = useState<ModBonus[]>([]);
    const [damageRollValue, setDamageRollValue] = useState<DamageRoll[]>([]);
    const [weaponToggle, setWeaponToggle] = useState<WeaponToggle>({
        light: false, heavy: false, finesse: false, thrown: false, twoHanded: false,
        range: false, versatile: false, ammunition: false, loading: false, reach: false,
    });
    const [versatileDamageRoll, setVersatileDamageRoll] = useState<DamageRoll>({
        count: 1, dice: 6, bonus: 0, damageType: DamageTypeEnum.ACID,
    });
    const [baseAcValue, setBaseAcValue] = useState<number>(0);

    const [damageRollErrMsg, setDamageRollErrMsg] = useState<string>('');
    const [versatileDamageRollErrMsg, setVersatileDamageRollErrMsg] = useState<string>('');

    const typeSelection = itemOptions.itemType.map((it) => ({ label: t(`items.${it}`), value: it }));
    const gearCategoriesSelection = itemOptions.gearCategories.map((c) => ({ label: t(`items.${c}`), value: c }));
    const weaponCategoriesSelection = itemOptions.weaponCategories.map((c) => ({ label: t(`items.${c}`), value: c }));
    const armorCategoriesSelection = itemOptions.armorCategories.map((c) => ({ label: t(`items.${c}`), value: c }));
    const raritySelection = itemOptions.itemRarity.map((r) => ({ label: t(`items.${r}`), value: r }));
    const currencyUnitSelection = [{ label: t('global.none'), value: '' }, ...itemOptions.currencyUnit.map((c) => ({ label: t(`items.${c}`), value: c }))];
    const equipSlotSelection = [{ label: t('global.none'), value: '' }, ...itemOptions.equipSlot.map((s) => ({ label: t(`items.${s}`), value: s }))];
    const damageTypeSelection = effectOptions.damageTypes.map((dt) => ({ label: t(`effects.${dt}`), value: dt }));
    const conditionSelection = effectOptions.immunities.map((c) => ({ label: t(`effects.${c}`), value: c }));
    const itemBonusStatSelection = itemOptions.itemBonusSelection.map((b) => ({ label: t(`items.${b}`), value: b }));
    const diceSelection = DICE_SELECTION.map((d) => ({ label: d, value: d }));

    const weaponToggleList = [
        { title: WeaponToggleEnum.LIGHT, description: t('items.lightDescription'), checked: weaponToggle.light, expandable: false, onChange: (val: boolean) => setWeaponToggle(p => ({ ...p, light: val, heavy: val ? false : p.heavy })) },
        { title: WeaponToggleEnum.HEAVY, description: t('items.heavyDescription'), checked: weaponToggle.heavy, expandable: false, onChange: (val: boolean) => setWeaponToggle(p => ({ ...p, heavy: val, light: val ? false : p.light })) },
        { title: WeaponToggleEnum.FINESSE, description: t('items.finesseDescription'), checked: weaponToggle.finesse, expandable: false, onChange: (val: boolean) => setWeaponToggle(p => ({ ...p, finesse: val })) },
        { title: WeaponToggleEnum.THROWN, description: t('items.thrownDescription'), checked: weaponToggle.thrown, expandable: false, onChange: (val: boolean) => setWeaponToggle(p => ({ ...p, thrown: val })) },
        { title: WeaponToggleEnum.TWO_HANDED, description: t('items.twoHandedDescription'), expandable: false, checked: weaponToggle.twoHanded, onChange: (val: boolean) => setWeaponToggle(p => ({ ...p, twoHanded: val, versatile: val ? false : p.versatile })) },
        { title: WeaponToggleEnum.RANGE, description: t('items.rangeDescription'), expandable: true, checked: weaponToggle.range, onChange: (val: boolean) => setWeaponToggle(p => ({ ...p, range: val, versatile: val ? false : p.versatile })) },
        { title: WeaponToggleEnum.VERSATILE, description: t('items.versatileDescription'), expandable: true, checked: weaponToggle.versatile, onChange: (val: boolean) => setWeaponToggle(p => ({ ...p, versatile: val, range: val ? false : p.range, twoHanded: val ? false : p.twoHanded })) },
        { title: WeaponToggleEnum.AMMUNITION, description: t('items.ammunitionDescription'), checked: weaponToggle.ammunition, expandable: false, onChange: (val: boolean) => setWeaponToggle(p => ({ ...p, ammunition: val })) },
        { title: WeaponToggleEnum.LOADING, description: t('items.loadingDescription'), checked: weaponToggle.loading, expandable: false, onChange: (val: boolean) => setWeaponToggle(p => ({ ...p, loading: val })) },
        { title: WeaponToggleEnum.REACH, description: t('items.reachDescription'), checked: weaponToggle.reach, expandable: false, onChange: (val: boolean) => setWeaponToggle(p => ({ ...p, reach: val })) },
    ];

    useEffect(() => {
        getItemData();
    }, []);

    useEffect(() => {
        if (!item) return;

        editItemForm.setFieldsValue({
            name: item.name,
            type: item.type,
            description: item.description,
            appearance: item.appearance,
            category: item.category,
            rarity: item.rarity,
            isMagicItem: item.isMagicItem,
            weight: item.weight,
            cost: item.cost,
            currencyUnit: item.currencyUnit,
            equipSlot: item.equipSlot,
            immunities: item.additionalProperties?.immunities || [],
            resistances: item.additionalProperties?.resistances || [],
            vulnerabilities: item.additionalProperties?.vulnerabilities || [],
            conditionImmunities: item.additionalProperties?.conditionImmunities || [],
            baseAc: item.armorProperties?.baseAc || 10,
            strengthReq: item.armorProperties?.strengthReq || 0,
            dexMod: item.armorProperties?.modifier.dexMod || false,
            conMod: item.armorProperties?.modifier.conMod || false,
            wisMod: item.armorProperties?.modifier.wisMod || false,
            flatAcBonus: item.armorProperties?.flatAcBonus || 0,
            maxModifier: item.armorProperties?.maxModifier || 0,
            stealthDisadvantage: item.armorProperties?.other.stealthDisadvantage || false,
            normalRange: item.weaponProperties?.range?.normal || 0,
            longRange: item.weaponProperties?.range?.long || 0,
        });

        setImageUrl(item.image || "");
        setSelectedType(item.type);
        setIsMagicItem(item.isMagicItem);
        setEquipSlotValue(item.equipSlot || "");

        // flat bonus
        if (item.flatBonus) {
            const fbKeys = Object.keys(item.flatBonus) as (keyof typeof item.flatBonus)[];
            const fb: Bonus[] = [];
            fbKeys.forEach(k => {
                if (item.flatBonus && item.flatBonus[k] !== undefined && item.flatBonus[k] !== 0) {
                    fb.push({ stats: k, value: item.flatBonus[k] as number });
                }
            });
            if (fb.length > 0) {
                setFlatBonusEnabled(true);
                setFlatBonusValue(fb);
            } else {
                setFlatBonusEnabled(false);
                setFlatBonusValue([]);
            }
        } else {
            setFlatBonusEnabled(false);
            setFlatBonusValue([]);
        }

        // override bonus
        if (item.overrideBonus) {
            const obKeys = Object.keys(item.overrideBonus) as (keyof typeof item.overrideBonus)[];
            const ob: Bonus[] = [];
            obKeys.forEach(k => {
                if (item.overrideBonus && item.overrideBonus[k] !== undefined && item.overrideBonus[k] !== 0) {
                    ob.push({ stats: k, value: item.overrideBonus[k] as number });
                }
            });
            if (ob.length > 0) {
                setOverrideBonusEnabled(true);
                setOverrideBonusValue(ob);
            } else if (item.type === ItemTypeEnum.ARMOR) {
                setOverrideBonusEnabled(true);
                setOverrideBonusValue([{
                    stats: 'ac',
                    value: item.armorProperties?.baseAc || 10,
                }]);
            } else {
                setOverrideBonusEnabled(false);
                setOverrideBonusValue([]);
            }
        } else if (item.type === ItemTypeEnum.ARMOR) {
            setOverrideBonusEnabled(true);
            setOverrideBonusValue([{
                stats: 'ac',
                value: item.armorProperties?.baseAc || 10,
            }]);
        } else {
            setOverrideBonusEnabled(false);
            setOverrideBonusValue([]);
        }

        // modifier bonus
        if (item.modifierBonus && item.modifierBonus.length > 0) {
            setModifierBonusEnabled(true);
            setModifierBonusValue(item.modifierBonus.map(m => ({ from: m.from, to: m.to, value: m.value })));
        } else {
            setModifierBonusEnabled(false);
            setModifierBonusValue([]);
        }

        // damage roll
        if (item.weaponProperties?.damageRoll) {
            setDamageRollValue(item.weaponProperties.damageRoll);
        } else {
            if (item.type === ItemTypeEnum.WEAPON) {
                setDamageRollValue([{ count: 1, dice: 6, bonus: 0, damageType: DamageTypeEnum.ACID }]);
            } else {
                setDamageRollValue([]);
            }
        }

        // weapon properties
        if (item.weaponProperties) {
            setWeaponToggle({
                light: item.weaponProperties.light,
                heavy: item.weaponProperties.heavy,
                finesse: item.weaponProperties.finesse,
                thrown: item.weaponProperties.thrown,
                twoHanded: item.weaponProperties.twoHanded,
                range: !!item.weaponProperties.range,
                versatile: !!item.weaponProperties.versatileDamageRoll,
                ammunition: item.weaponProperties.ammunition,
                loading: item.weaponProperties.loading,
                reach: item.weaponProperties.reach,
            });

            if (item.weaponProperties.versatileDamageRoll) {
                setVersatileDamageRoll(item.weaponProperties.versatileDamageRoll);
            } else {
                setVersatileDamageRoll({ count: 1, dice: 6, bonus: 0, damageType: DamageTypeEnum.ACID });
            }
        } else {
            setWeaponToggle({
                light: false, heavy: false, finesse: false, thrown: false, twoHanded: false,
                range: false, versatile: false, ammunition: false, loading: false, reach: false,
            });
            setVersatileDamageRoll({ count: 1, dice: 6, bonus: 0, damageType: DamageTypeEnum.ACID });
        }

        if (item.armorProperties) {
            setBaseAcValue(item.armorProperties.baseAc);
        } else {
            setBaseAcValue(0);
        }

    }, [item, editItemForm]);

    useEffect(() => {
        if (selectedType !== ItemTypeEnum.ARMOR) return;
        setOverrideBonusValue(prev => {
            const hasAc = prev.some((b) => b.stats === 'ac');
            if (!hasAc) {
                return [...prev, { stats: 'ac', value: baseAcValue }];
            }
            return prev.map((b) => b.stats === 'ac' ? { ...b, value: baseAcValue } : b);
        });
    }, [baseAcValue, selectedType]);

    const getItemData = async () => {
        const data = await getData();
        setItem(data);
    };

    const handleFileChange = (imageUrl: string) => setImageUrl(imageUrl);

    const handleTypeChange = (value: string) => {
        editItemForm.setFieldValue('category', null);
        setSelectedType(value);
        if (value === ItemTypeEnum.WEAPON) {
            setDamageRollValue([{ count: 1, dice: 6, bonus: 0, damageType: DamageTypeEnum.ACID }]);
        } else {
            setDamageRollValue([]);
        }

        if (value === ItemTypeEnum.ARMOR) {
            setOverrideBonusEnabled(true);
            const currentAc = editItemForm.getFieldValue('baseAc') || 10;
            if (overrideBonusValue.length === 0) {
                setOverrideBonusValue([{ stats: 'ac', value: currentAc }]);
            } else if (!overrideBonusValue.some(b => b.stats === 'ac')) {
                setOverrideBonusValue(prev => [...prev, { stats: 'ac', value: currentAc }]);
            }
        }
    };

    const handleMagicItemChange = (value: boolean) => setIsMagicItem(value);
    const handleEquipSlotChange = (value: string) => setEquipSlotValue(value);
    const handleFlatBonusChange = (value: boolean) => setFlatBonusEnabled(value);
    const handleOverrideBonusChange = (value: boolean) => setOverrideBonusEnabled(value);
    const handleModifierBonusChange = (value: boolean) => setModifierBonusEnabled(value);

    const handleAddFlatBonus = () => setFlatBonusValue((prev) => [...prev, { stats: '', value: 0 }]);
    const handleUpdateFlatBonusStat = (index: number, stat: string) => setFlatBonusValue((prev) => prev.map((b, i) => (i === index ? { ...b, stats: stat } : b)));
    const handleUpdateFlatBonusValue = (index: number, val: number) => setFlatBonusValue((prev) => prev.map((b, i) => (i === index ? { ...b, value: val } : b)));
    const handleDeleteFlatBonus = (index: number) => setFlatBonusValue((prev) => prev.filter((_, i) => i !== index));

    const handleAddOverrideBonus = () => setOverrideBonusValue((prev) => [...prev, { stats: '', value: 0 }]);
    const handleUpdateOverrideBonusStat = (index: number, stat: string) => setOverrideBonusValue((prev) => prev.map((b, i) => (i === index ? { ...b, stats: stat } : b)));
    const handleUpdateOverrideBonusValue = (index: number, val: number) => setOverrideBonusValue((prev) => prev.map((b, i) => (i === index ? { ...b, value: val } : b)));
    const handleDeleteOverrideBonus = (index: number) => setOverrideBonusValue((prev) => prev.filter((_, i) => i !== index));

    const handleAddModifierBonus = () => setModifierBonusValue((prev) => [...prev, { from: '', to: '', value: 0 }]);
    const handleUpdateModifierBonusFrom = (index: number, from: string) => setModifierBonusValue((prev) => prev.map((b, i) => (i === index ? { ...b, from } : b)));
    const handleUpdateModifierBonusTo = (index: number, to: string) => setModifierBonusValue((prev) => prev.map((b, i) => (i === index ? { ...b, to } : b)));
    const handleUpdateModifierBonusValue = (index: number, val: number) => setModifierBonusValue((prev) => prev.map((b, i) => (i === index ? { ...b, value: val } : b)));
    const handleDeleteModifierBonus = (index: number) => setModifierBonusValue((prev) => prev.filter((_, i) => i !== index));

    const handleAddDamageRoll = () => {
        setDamageRollValue((prev) => [...prev, { count: 1, dice: 6, bonus: 0, damageType: DamageTypeEnum.ACID }]);
        setDamageRollErrMsg("");
    };
    const handleUpdateDamageRollCount = (index: number, count: number) => setDamageRollValue((prev) => prev.map((r, i) => (i === index ? { ...r, count } : r)));
    const handleUpdateDamageRollDice = (index: number, dice: number) => setDamageRollValue((prev) => prev.map((r, i) => (i === index ? { ...r, dice } : r)));
    const handleUpdateDamageRollBonus = (index: number, bonus: number) => setDamageRollValue((prev) => prev.map((r, i) => (i === index ? { ...r, bonus } : r)));
    const handleUpdateDamageRollType = (index: number, damageType: string) => setDamageRollValue((prev) => prev.map((r, i) => (i === index ? { ...r, damageType } : r)));
    const handleDeleteDamageRoll = (index: number) => setDamageRollValue((prev) => prev.filter((_, i) => i !== index));

    const handleUpdateVersatileDamageRoll = (value: DamageRoll) => {
        setVersatileDamageRoll(value);
        setVersatileDamageRollErrMsg("");
    };

    const handleSetBaseAcValue = (value: number) => setBaseAcValue(value);

    const submitEditItem: FormProps<EditItemFormValues>['onFinish'] = async (values) => {
        if (!item) return;

        if (selectedType === ItemTypeEnum.WEAPON && damageRollValue.length === 0) {
            setDamageRollErrMsg(t('items.damageRollErrMsg'));
            return;
        }

        if (selectedType === ItemTypeEnum.WEAPON && weaponToggle.versatile) {
            if (versatileDamageRoll.count === 0 || versatileDamageRoll.dice === 0 || versatileDamageRoll.damageType === '') {
                setVersatileDamageRollErrMsg(t('items.versatileDamageRollErrMsg'));
                return;
            }
            setVersatileDamageRollErrMsg("");
        }

        const additionalProperties = {
            immunities: values.immunities,
            resistances: values.resistances,
            vulnerabilities: values.vulnerabilities,
            conditionImmunities: values.conditionImmunities,
        };

        const weaponProperties = {
            damageRoll: damageRollValue,
            light: weaponToggle.light,
            heavy: weaponToggle.heavy,
            finesse: weaponToggle.finesse,
            thrown: weaponToggle.thrown,
            twoHanded: weaponToggle.twoHanded,
            range: weaponToggle.range ? {
                normal: values.normalRange ?? 0,
                long: values.longRange && values.longRange > 0 ? values.longRange : null,
            } : null,
            versatileDamageRoll: weaponToggle.versatile ? {
                count: versatileDamageRoll.count,
                dice: versatileDamageRoll.dice,
                bonus: versatileDamageRoll.bonus,
                damageType: versatileDamageRoll.damageType,
            } : null,
            ammunition: weaponToggle.ammunition,
            loading: weaponToggle.loading,
            reach: weaponToggle.reach,
        };

        const armorProperties = {
            baseAc: values.baseAc ?? 10,
            strengthReq: values.strengthReq ? values.strengthReq : 0,
            modifier: {
                dexMod: values.dexMod ?? false,
                conMod: values.conMod ?? false,
                wisMod: values.wisMod ?? false,
            },
            flatAcBonus: values.flatAcBonus ? values.flatAcBonus : 0,
            maxModifier: values.maxModifier ? values.maxModifier : 0,
            other: {
                stealthDisadvantage: values.stealthDisadvantage || false,
            }
        };

        const flatBonusTransformed = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0, ac: 0, speed: 0, hp: 0 };
        flatBonusValue.forEach((bonus) => {
            if (bonus.stats && bonus.stats in flatBonusTransformed) {
                flatBonusTransformed[bonus.stats as keyof typeof flatBonusTransformed] = bonus.value;
            }
        });

        const overrideBonusTransformed = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0, ac: 0, speed: 0, hp: 0 };
        overrideBonusValue.forEach((bonus) => {
            if (bonus.stats && bonus.stats in overrideBonusTransformed) {
                overrideBonusTransformed[bonus.stats as keyof typeof overrideBonusTransformed] = bonus.value;
            }
        });

        const modifierBonusFiltered = modifierBonusValue.filter((bonus) => bonus.from && bonus.to && bonus.value > 0);

        const submitData: Item = {
            ...item,
            image: imageUrl,
            name: values.name,
            type: values.type,
            description: values.description,
            appearance: values.appearance,
            category: values.category,
            rarity: values.rarity,
            isMagicItem: isMagicItem,
            weight: values.weight,
            cost: values.cost,
            currencyUnit: values.cost > 0 ? values.currencyUnit : "",
            equipSlot: values.type === ItemTypeEnum.GEAR ? (values.equipSlot || null) : null,
            weaponProperties: selectedType === ItemTypeEnum.WEAPON ? weaponProperties : null,
            armorProperties: selectedType === ItemTypeEnum.ARMOR ? armorProperties : null,
            additionalProperties: additionalProperties,
            flatBonus: flatBonusEnabled && flatBonusValue.length > 0 && (selectedType !== ItemTypeEnum.GEAR || equipSlotValue) ? flatBonusTransformed : null,
            overrideBonus: overrideBonusEnabled && overrideBonusValue.length > 0 && (selectedType !== ItemTypeEnum.GEAR || equipSlotValue) ? overrideBonusTransformed : null,
            modifierBonus: modifierBonusEnabled && modifierBonusFiltered.length > 0 && (selectedType !== ItemTypeEnum.GEAR || equipSlotValue) ? modifierBonusFiltered : null,
        };

        setSubmitLoad(true);
        try {
            await onEditSubmit(submitData, item);
            handleCloseModal();
        } finally {
            setSubmitLoad(false);
        }
    };

    const handleCloseModal = () => {
        onClose();
    };

    return {
        item, editItemForm, typeSelection, selectedType, gearCategoriesSelection, weaponCategoriesSelection,
        armorCategoriesSelection, raritySelection, isMagicItem, currencyUnitSelection, equipSlotSelection,
        damageTypeSelection, conditionSelection, itemBonusStatSelection, equipSlotValue, flatBonusEnabled,
        overrideBonusEnabled, modifierBonusEnabled, flatBonusValue, overrideBonusValue, modifierBonusValue,
        damageRollValue, diceSelection, damageRollErrMsg, weaponToggleList, versatileDamageRoll,
        versatileDamageRollErrMsg, submitLoad, handleFlatBonusChange, handleOverrideBonusChange,
        handleModifierBonusChange, handleAddFlatBonus, handleUpdateFlatBonusStat, handleUpdateFlatBonusValue,
        handleDeleteFlatBonus, handleAddOverrideBonus, handleUpdateOverrideBonusStat, handleUpdateOverrideBonusValue,
        handleDeleteOverrideBonus, handleAddModifierBonus, handleUpdateModifierBonusFrom, handleUpdateModifierBonusTo,
        handleUpdateModifierBonusValue, handleDeleteModifierBonus, handleAddDamageRoll, handleUpdateDamageRollCount,
        handleUpdateDamageRollDice, handleUpdateDamageRollBonus, handleUpdateDamageRollType, handleDeleteDamageRoll,
        handleFileChange, handleTypeChange, handleMagicItemChange, handleEquipSlotChange, handleUpdateVersatileDamageRoll,
        handleSetBaseAcValue, submitEditItem, handleCloseModal,
    }
}
