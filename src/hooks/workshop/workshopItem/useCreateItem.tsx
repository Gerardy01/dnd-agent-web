import { useEffect, useRef, useState } from "react";
import { Form, type FormProps } from "antd";

// utils
import { DamageTypeEnum, ItemTypeEnum, WeaponToggleEnum } from "@/utils/enums";

// constants
import { DICE_SELECTION } from "@/constants/selections";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// hooks
import { useTranslation } from "react-i18next";
import useStaticModal from "@/hooks/global/useStaticModal";

// interfaces
interface CreateItemFormValues {
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


export default function useCreateItem() {

    const { t } = useTranslation();
    const { } = useStaticModal();

    const { itemOptions, effectOptions } = useReferenceStore();

    const [createItemForm] = Form.useForm();

    const fileInputRef = useRef<HTMLInputElement>(null);

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
        light: false,
        heavy: false,
        finesse: false,
        thrown: false,
        twoHanded: false,
        range: false,
        versatile: false,
        ammunition: false,
        loading: false,
        reach: false,
    });
    const [versatileDamageRoll, setVersatileDamageRoll] = useState<DamageRoll>({
        count: 1,
        dice: 6,
        bonus: 0,
        damageType: damageRollValue.length > 0 ? damageRollValue[0].damageType : DamageTypeEnum.ACID,
    });

    const [damageRollErrMsg, setDamageRollErrMsg] = useState<string>('');
    const [versatileDamageRollErrMsg, setVersatileDamageRollErrMsg] = useState<string>('');

    const typeSelection = itemOptions.itemType.map((itemType) => ({
        label: t(`items.${itemType}`),
        value: itemType,
    }));

    const gearCategoriesSelection = itemOptions.gearCategories.map((category) => ({
        label: t(`items.${category}`),
        value: category,
    }));

    const weaponCategoriesSelection = itemOptions.weaponCategories.map((category) => ({
        label: t(`items.${category}`),
        value: category,
    }));

    const armorCategoriesSelection = itemOptions.armorCategories.map((category) => ({
        label: t(`items.${category}`),
        value: category,
    }));

    const raritySelection = itemOptions.itemRarity.map((rarity) => ({
        label: t(`items.${rarity}`),
        value: rarity,
    }));

    const currencyUnitSelection = [{
        label: t('global.none'),
        value: '',
    }, ...itemOptions.currencyUnit.map((currency) => ({
        label: t(`items.${currency}`),
        value: currency,
    }))];

    const equipSlotSelection = [{
        label: t('global.none'),
        value: '',
    }, ...itemOptions.equipSlot.map((slot) => ({
        label: t(`items.${slot}`),
        value: slot,
    }))];

    const damageTypeSelection = effectOptions.damageTypes.map((damageType) => ({
        label: t(`effects.${damageType}`),
        value: damageType,
    }));

    const conditionSelection = effectOptions.immunities.map((condition) => ({
        label: t(`effects.${condition}`),
        value: condition,
    }));

    const itemBonusStatSelection = itemOptions.itemBonusSelection.map((bonus) => ({
        label: t(`items.${bonus}`),
        value: bonus,
    }));

    const diceSelection = DICE_SELECTION.map((dice) => ({
        label: dice,
        value: dice,
    }));

    const weaponToggleList = [
        {
            title: WeaponToggleEnum.LIGHT,
            description: t('items.lightDescription'),
            checked: weaponToggle.light,
            expandable: false,
            onChange: (val: boolean) => setWeaponToggle(prev => ({ ...prev, light: val, heavy: val ? false : prev.heavy })),
        },
        {
            title: WeaponToggleEnum.HEAVY,
            description: t('items.heavyDescription'),
            checked: weaponToggle.heavy,
            expandable: false,
            onChange: (val: boolean) => setWeaponToggle(prev => ({ ...prev, heavy: val, light: val ? false : prev.light })),
        },
        {
            title: WeaponToggleEnum.FINESSE,
            description: t('items.finesseDescription'),
            checked: weaponToggle.finesse,
            expandable: false,
            onChange: (val: boolean) => setWeaponToggle(prev => ({ ...prev, finesse: val })),
        },
        {
            title: WeaponToggleEnum.THROWN,
            description: t('items.thrownDescription'),
            checked: weaponToggle.thrown,
            expandable: false,
            onChange: (val: boolean) => setWeaponToggle(prev => ({ ...prev, thrown: val })),
        },
        {
            title: WeaponToggleEnum.TWO_HANDED,
            description: t('items.twoHandedDescription'),
            expandable: false,
            checked: weaponToggle.twoHanded,
            onChange: (val: boolean) => setWeaponToggle(prev => ({ ...prev, twoHanded: val, versatile: val ? false : prev.versatile })),
        },
        {
            title: WeaponToggleEnum.RANGE,
            description: t('items.rangeDescription'),
            expandable: true,
            checked: weaponToggle.range,
            onChange: (val: boolean) => setWeaponToggle(prev => ({ ...prev, range: val, versatile: val ? false : prev.versatile })),
        },
        {
            title: WeaponToggleEnum.VERSATILE,
            description: t('items.versatileDescription'),
            expandable: true,
            checked: weaponToggle.versatile,
            onChange: (val: boolean) => setWeaponToggle(prev => ({ ...prev, versatile: val, range: val ? false : prev.range, twoHanded: val ? false : prev.twoHanded })),
        },
        {
            title: WeaponToggleEnum.AMMUNITION,
            description: t('items.ammunitionDescription'),
            checked: weaponToggle.ammunition,
            expandable: false,
            onChange: (val: boolean) => setWeaponToggle(prev => ({ ...prev, ammunition: val })),
        },
        {
            title: WeaponToggleEnum.LOADING,
            description: t('items.loadingDescription'),
            checked: weaponToggle.loading,
            expandable: false,
            onChange: (val: boolean) => setWeaponToggle(prev => ({ ...prev, loading: val })),
        },
        {
            title: WeaponToggleEnum.REACH,
            description: t('items.reachDescription'),
            checked: weaponToggle.reach,
            expandable: false,
            onChange: (val: boolean) => setWeaponToggle(prev => ({ ...prev, reach: val })),
        },
    ];

    useEffect(() => {
        createItemForm.setFieldValue('category', null);

        if (selectedType === ItemTypeEnum.WEAPON) {
            setDamageRollValue([{ count: 1, dice: 6, bonus: 0, damageType: DamageTypeEnum.ACID }]);
        } else {
            setDamageRollValue([]);
        }

    }, [selectedType]);

    const handleFileChange = (file: File) => {
        if (!file) return;
        // Temporarily preview with a local object URL
        // Replace setImageUrl call with the S3 URL returned from the API when wiring the real upload
        setImageUrl(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setImageUrl("");
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
    };

    const handleMagicItemChange = (value: boolean) => {
        setIsMagicItem(value);
    };

    const handleEquipSlotChange = (value: string) => {
        setEquipSlotValue(value);
    };

    const handleFlatBonusChange = (value: boolean) => {
        setFlatBonusEnabled(value);
    };

    const handleOverrideBonusChange = (value: boolean) => {
        setOverrideBonusEnabled(value);
    };

    const handleModifierBonusChange = (value: boolean) => {
        setModifierBonusEnabled(value);
    };

    const handleAddFlatBonus = () => {
        setFlatBonusValue((prev) => [...prev, { stats: '', value: 0 }]);
    };

    const handleUpdateFlatBonusStat = (index: number, stat: string) => {
        setFlatBonusValue((prev) =>
            prev.map((b, i) => (i === index ? { ...b, stats: stat } : b))
        );
    };

    const handleUpdateFlatBonusValue = (index: number, val: number) => {
        setFlatBonusValue((prev) =>
            prev.map((b, i) => (i === index ? { ...b, value: val } : b))
        );
    };

    const handleDeleteFlatBonus = (index: number) => {
        setFlatBonusValue((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddOverrideBonus = () => {
        setOverrideBonusValue((prev) => [...prev, { stats: '', value: 0 }]);
    };

    const handleUpdateOverrideBonusStat = (index: number, stat: string) => {
        setOverrideBonusValue((prev) =>
            prev.map((b, i) => (i === index ? { ...b, stats: stat } : b))
        );
    };

    const handleUpdateOverrideBonusValue = (index: number, val: number) => {
        setOverrideBonusValue((prev) =>
            prev.map((b, i) => (i === index ? { ...b, value: val } : b))
        );
    };

    const handleDeleteOverrideBonus = (index: number) => {
        setOverrideBonusValue((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddModifierBonus = () => {
        setModifierBonusValue((prev) => [...prev, { from: '', to: '', value: 0 }]);
    };

    const handleUpdateModifierBonusFrom = (index: number, from: string) => {
        setModifierBonusValue((prev) =>
            prev.map((b, i) => (i === index ? { ...b, from } : b))
        );
    };

    const handleUpdateModifierBonusTo = (index: number, to: string) => {
        setModifierBonusValue((prev) =>
            prev.map((b, i) => (i === index ? { ...b, to } : b))
        );
    };

    const handleUpdateModifierBonusValue = (index: number, val: number) => {
        setModifierBonusValue((prev) =>
            prev.map((b, i) => (i === index ? { ...b, value: val } : b))
        );
    };

    const handleDeleteModifierBonus = (index: number) => {
        setModifierBonusValue((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddDamageRoll = () => {
        setDamageRollValue((prev) => [...prev, { count: 1, dice: 6, bonus: 0, damageType: DamageTypeEnum.ACID }]);
        setDamageRollErrMsg("");
    };

    const handleUpdateDamageRollCount = (index: number, count: number) => {
        setDamageRollValue((prev) =>
            prev.map((r, i) => (i === index ? { ...r, count } : r))
        );
    };

    const handleUpdateDamageRollDice = (index: number, dice: number) => {
        setDamageRollValue((prev) =>
            prev.map((r, i) => (i === index ? { ...r, dice } : r))
        );
    };

    const handleUpdateDamageRollBonus = (index: number, bonus: number) => {
        setDamageRollValue((prev) =>
            prev.map((r, i) => (i === index ? { ...r, bonus } : r))
        );
    };

    const handleUpdateDamageRollType = (index: number, damageType: string) => {
        setDamageRollValue((prev) =>
            prev.map((r, i) => (i === index ? { ...r, damageType } : r))
        );
    };

    const handleDeleteDamageRoll = (index: number) => {
        setDamageRollValue((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateVersatileDamageRoll = (value: DamageRoll) => {
        setVersatileDamageRoll(value);
        setVersatileDamageRollErrMsg("");
    };

    const submitCreateItem: FormProps<CreateItemFormValues>['onFinish'] = async (values) => {

        if (selectedType === ItemTypeEnum.WEAPON && damageRollValue.length === 0) {
            setDamageRollErrMsg("Please add at least one damage roll");
            return;
        }

        if (selectedType === ItemTypeEnum.WEAPON && weaponToggle.versatile) {
            if (versatileDamageRoll.count === 0 || versatileDamageRoll.dice === 0 || versatileDamageRoll.damageType === '') {
                setVersatileDamageRollErrMsg("Please input all field properly.");
                return;
            }
            setVersatileDamageRollErrMsg("");
        }

        const additionalProperties = {
            immunities: values.immunities,
            resistances: values.resistances,
            vulnerabilities: values.vulnerabilities,
            conditionImmunities: values.conditionImmunities,
        }

        const weaponProperties = {
            damageRoll: damageRollValue,
            light: weaponToggle.light,
            heavy: weaponToggle.heavy,
            finesse: weaponToggle.finesse,
            thrown: weaponToggle.thrown,
            twoHanded: weaponToggle.twoHanded,
            range: weaponToggle.range ? {
                normal: values.normalRange,
                long: values.longRange && values.longRange > 0 ? values.longRange : null,
            } : null,
            versatileDamageRoll: weaponToggle.twoHanded ? {
                count: versatileDamageRoll.count,
                dice: versatileDamageRoll.dice,
                bonus: versatileDamageRoll.bonus,
                damageType: versatileDamageRoll.damageType,
            } : null,
            ammunition: weaponToggle.ammunition,
            loading: weaponToggle.loading,
            reach: weaponToggle.reach,
        }

        const armorProperties = {
            baseAc: values.baseAc,
            strengthReq: values.strengthReq ? values.strengthReq : 0,
            modifier: {
                dexMod: values.dexMod,
                conMod: values.conMod,
                wisMod: values.wisMod,
            },
            flatAcBonus: values.flatAcBonus ? values.flatAcBonus : 0,
            maxModifier: values.maxModifier ? values.maxModifier : 0,
            other: {
                stealthDisadvantage: values.stealthDisadvantage,
            }
        }

        const flatBonusTransformed = {
            str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0, ac: 0, speed: 0, hp: 0,
        };
        flatBonusValue.forEach((bonus) => {
            if (bonus.stats && bonus.stats in flatBonusTransformed) {
                flatBonusTransformed[bonus.stats as keyof typeof flatBonusTransformed] = bonus.value;
            }
        });

        const overrideBonusTransformed = {
            str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0, ac: 0, speed: 0, hp: 0,
        };
        overrideBonusValue.forEach((bonus) => {
            if (bonus.stats && bonus.stats in overrideBonusTransformed) {
                overrideBonusTransformed[bonus.stats as keyof typeof overrideBonusTransformed] = bonus.value;
            }
        });
        const modifierBonusFiltered = modifierBonusValue.filter((bonus) => bonus.from && bonus.to && bonus.value > 0);

        const submitData = {
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
            equipSlot: values.type === ItemTypeEnum.GEAR ? values.equipSlot : null,
            weaponProperties: selectedType === ItemTypeEnum.WEAPON ? weaponProperties : null,
            armorProperties: selectedType === ItemTypeEnum.ARMOR ? armorProperties : null,
            additionalProperties: additionalProperties,
            flatBonuses: flatBonusEnabled && flatBonusValue.length > 0 && (selectedType !== ItemTypeEnum.GEAR || equipSlotValue) ? flatBonusTransformed : null,
            overrideBonuses: overrideBonusEnabled && overrideBonusValue.length > 0 && (selectedType !== ItemTypeEnum.GEAR || equipSlotValue) ? overrideBonusTransformed : null,
            modifierBonuses: modifierBonusEnabled && modifierBonusFiltered.length > 0 && (selectedType !== ItemTypeEnum.GEAR || equipSlotValue) ? modifierBonusFiltered : null,
        }

        console.log(submitData);
    }

    const restartForm = () => {
        createItemForm.resetFields();
        setImageUrl("");
        setSelectedType(ItemTypeEnum.GEAR);
        setIsMagicItem(false);
        setEquipSlotValue("");
        setFlatBonusEnabled(false);
        setOverrideBonusEnabled(false);
        setModifierBonusEnabled(false);
        setFlatBonusValue([]);
        setOverrideBonusValue([]);
        setModifierBonusValue([]);
        setDamageRollValue([]);
        setDamageRollErrMsg("");
        setWeaponToggle({
            light: false,
            heavy: false,
            finesse: false,
            thrown: false,
            twoHanded: false,
            range: false,
            versatile: false,
            ammunition: false,
            loading: false,
            reach: false,
        });
    };

    return {
        createItemForm,
        fileInputRef,
        imageUrl,
        typeSelection,
        selectedType,
        gearCategoriesSelection,
        weaponCategoriesSelection,
        armorCategoriesSelection,
        raritySelection,
        isMagicItem,
        currencyUnitSelection,
        equipSlotSelection,
        damageTypeSelection,
        conditionSelection,
        itemBonusStatSelection,
        equipSlotValue,
        flatBonusEnabled,
        overrideBonusEnabled,
        modifierBonusEnabled,
        flatBonusValue,
        overrideBonusValue,
        modifierBonusValue,
        damageRollValue,
        diceSelection,
        damageRollErrMsg,
        weaponToggleList,
        versatileDamageRoll,
        versatileDamageRollErrMsg,
        handleFlatBonusChange,
        handleOverrideBonusChange,
        handleModifierBonusChange,
        handleAddFlatBonus,
        handleUpdateFlatBonusStat,
        handleUpdateFlatBonusValue,
        handleDeleteFlatBonus,
        handleAddOverrideBonus,
        handleUpdateOverrideBonusStat,
        handleUpdateOverrideBonusValue,
        handleDeleteOverrideBonus,
        handleAddModifierBonus,
        handleUpdateModifierBonusFrom,
        handleUpdateModifierBonusTo,
        handleUpdateModifierBonusValue,
        handleDeleteModifierBonus,
        handleAddDamageRoll,
        handleUpdateDamageRollCount,
        handleUpdateDamageRollDice,
        handleUpdateDamageRollBonus,
        handleUpdateDamageRollType,
        handleDeleteDamageRoll,
        handleFileChange,
        handleRemoveImage,
        handleTypeChange,
        restartForm,
        handleMagicItemChange,
        handleEquipSlotChange,
        handleUpdateVersatileDamageRoll,
        submitCreateItem,
    }
}