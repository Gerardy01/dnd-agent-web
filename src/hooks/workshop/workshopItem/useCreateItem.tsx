import { useRef, useState } from "react";
import { Form, type FormProps } from "antd";

// utils
import { ItemTypeEnum } from "@/utils/enums";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// hooks
import { useTranslation } from "react-i18next";

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
}


export default function useCreateItem() {

    const { t } = useTranslation();

    const { itemOptions, effectOptions } = useReferenceStore();

    const [createItemForm] = Form.useForm();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string>(ItemTypeEnum.GEAR);
    const [isMagicItem, setIsMagicItem] = useState<boolean>(false);

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

    const handleFileChange = (file: File) => {
        if (!file) return;
        // Temporarily preview with a local object URL
        // Replace setImageUrl call with the S3 URL returned from the API when wiring the real upload
        setImageUrl(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setImageUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
    };

    const handleMagicItemChange = (value: boolean) => {
        setIsMagicItem(value);
    };

    const submitCreateItem: FormProps<CreateItemFormValues>['onFinish'] = async (values) => {
        console.log(values);
    }

    const restartForm = () => {
        createItemForm.resetFields();
        setImageUrl(null);
        setSelectedType(ItemTypeEnum.GEAR);
        setIsMagicItem(false);
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
        handleFileChange,
        handleRemoveImage,
        handleTypeChange,
        restartForm,
        handleMagicItemChange,
        submitCreateItem,
    }
}