import { useEffect, useRef, useState } from "react";
import { Form, type FormProps } from "antd";
import { useTranslation } from "react-i18next";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// utils
import { SpellPreparationTypeEnum } from "@/utils/enums";

// interfaces
import type { CreateClassSubDTO, SpellcastingProperties, MaxKnown, Features, ClassResourceDTO } from "@/models/classInterfaces";
import type { WorkshopSpellReturn } from "@/models/spellInterfaces";
import type { PresetMaxKnown } from "@/models/referenceInterfaces";
export interface CreateClassResourceWithPreview extends ClassResourceDTO {
    previewUrl?: string;
}
interface SpellGroup {
    level: number;
    spells: WorkshopSpellReturn[];
}

interface CreateClassSubFormValues {
    name: string;
    description: string;
    spellcastingAbility?: string;
    spellPreparationType?: string;
    spellcastingType?: string;
    preparedLvlBonus: number;
    preparedModBonus: boolean;
}

export default function useSubclassForm(
    onCancel: () => void,
    onSubmit: (data: Omit<CreateClassSubDTO, 'workshopClassId'>) => Promise<void>,
    spells: WorkshopSpellReturn[]
) {

    const { t } = useTranslation();
    const [subclassForm] = Form.useForm();

    const { classOptions } = useReferenceStore();

    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const [isSpellcaster, setIsSpellcaster] = useState<boolean>(false);

    const [features, setFeatures] = useState<Features[]>([]);
    const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null); // null: none, -1: adding new

    const [featureErrMsg, setFeatureErrMsg] = useState<string>('');
    const [spellErrMsg, setSpellErrMsg] = useState<string>('');

    const [resources, setResources] = useState<CreateClassResourceWithPreview[]>([]);
    const [editingResourceIndex, setEditingResourceIndex] = useState<number | null>(null); // null: none, -1: adding new
    const [resourceErrMsg, setResourceErrMsg] = useState<string>('');

    const [spellSearch, setSpellSearch] = useState<string>('');
    const [selectedSpellIds, setSelectedSpellIds] = useState<number[]>([]);

    const filteredSpells = spellSearch
        ? spells.filter((s) => s.name.toLowerCase().includes(spellSearch.toLowerCase()))
        : spells;

    const spellList: SpellGroup[] = filteredSpells.reduce<SpellGroup[]>((groups, spell) => {
        const existing = groups.find((g) => g.level === spell.level);
        if (existing) {
            existing.spells.push(spell);
        } else {
            groups.push({ level: spell.level, spells: [spell] });
        }
        return groups;
    }, []).sort((a, b) => a.level - b.level);

    const [maxKnownTotal, setMaxKnownTotal] = useState<number>(20);

    const [maxCantripKnown, setMaxCantripKnown] = useState<MaxKnown[]>([...Array(maxKnownTotal)].map((_, i) => ({ level: i + 1, amount: 0 })));
    const [maxSpellKnown, setMaxSpellKnown] = useState<MaxKnown[]>([...Array(maxKnownTotal)].map((_, i) => ({ level: i + 1, amount: 0 })));

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: scrollRef.current.scrollWidth,
                behavior: 'smooth'
            });
        }
    }, [maxKnownTotal]);

    const diceSelection = classOptions.diceSelection.map((dice) => ({ label: dice, value: dice }));
    const spellcastingAbilitySelection = classOptions.spellcastingAbility.map((ability) => ({ label: t(`items.${ability}`), value: ability }));
    const spellPreparationSelection = classOptions.spellPreparationType.map((prep) => ({ label: t(`classes.${prep}`), value: prep }));
    const spellcastingTypeSelection = classOptions.spellcastingType.map((type) => ({ label: t(`classes.${type}`), value: type }));
    const featureTypeSelection = classOptions.classFeatureType.map((type) => ({ label: t(`classes.${type}`), value: type }));

    const preparedLvlBonusSelection = [
        { label: t('classes.noLevelBonus'), value: 0 },
        { label: t('classes.halfLevelBonus'), value: 50 },
        { label: t('classes.fullLevelBonus'), value: 100 },
    ];

    const handleFileChange = (url: string) => {
        setImageUrl(url);
    }

    const restartForm = () => {
        subclassForm.resetFields();
        setImageUrl("");
        setIsSpellcaster(false);
        setSpellSearch('');
        setSelectedSpellIds([]);
        setFeatures([]);
        setFeatureErrMsg('');
        setSpellErrMsg('');
        setEditingFeatureIndex(null);
        setResources([]);
        setResourceErrMsg('');
        setEditingResourceIndex(null);
    }

    const handleCancelForm = () => {
        restartForm();
        onCancel();
    }

    const handleMaxKnownTotal = (newValue: number) => {
        setMaxKnownTotal(newValue);
        setMaxCantripKnown([...Array(newValue)].map((_, i) => ({ level: i + 1, amount: 0 })));
        setMaxSpellKnown([...Array(newValue)].map((_, i) => ({ level: i + 1, amount: 0 })));
    }

    const handleMaxCantripKnown = (index: number, amount: number) => {
        setMaxCantripKnown((prev) => {
            const newState = [...prev];
            newState[index] = { ...newState[index], amount };
            return newState;
        });
    }

    const handleMaxSpellKnown = (index: number, amount: number) => {
        setMaxSpellKnown((prev) => {
            const newState = [...prev];
            newState[index] = { ...newState[index], amount };
            return newState;
        });
    }

    const nonSpellcasterPreset: PresetMaxKnown = {
        name: "nonSpellcaster",
        maxCantripKnown: Array(20).fill(0),
        maxSpellKnown: Array(20).fill(0)
    };

    const presets: PresetMaxKnown[] = [nonSpellcasterPreset, ...classOptions.presetMaxKnown];

    const handleApplyPreset = (preset: PresetMaxKnown) => {
        setMaxCantripKnown(preset.maxCantripKnown.map((amount, i) => ({ level: i + 1, amount })));
        setMaxSpellKnown(preset.maxSpellKnown.map((amount, i) => ({ level: i + 1, amount })));
        setMaxKnownTotal(preset.maxCantripKnown.length);
    }

    const handleToggleSpell = (spellId: number) => {
        setSelectedSpellIds((prev) =>
            prev.includes(spellId) ? prev.filter((id) => id !== spellId) : [...prev, spellId]
        );
        setSpellErrMsg("");
    }

    const handleStartAddFeature = () => {
        setEditingFeatureIndex(-1);
        setFeatureErrMsg("");
    }

    const handleStartEditFeature = (index: number) => {
        setEditingFeatureIndex(index);
    }

    const handleCancelFeature = () => {
        setEditingFeatureIndex(null);
    }

    const handleSaveFeature: FormProps<Features>['onFinish'] = async (feature) => {
        setFeatures((prev) => {
            let newList = [...prev];
            if (editingFeatureIndex === -1) {
                newList.push(feature);
            } else if (editingFeatureIndex !== null) {
                newList[editingFeatureIndex] = feature;
            }
            // Sort by level
            return newList.sort((a, b) => a.level - b.level);
        });
        setEditingFeatureIndex(null);
        setFeatureErrMsg("");
    }

    const handleDeleteFeature = (index: number) => {
        setFeatures((prev) => prev.filter((_, i) => i !== index));
        setFeatureErrMsg("");
    }

    const handleStartAddResource = () => {
        setEditingResourceIndex(-1);
        setResourceErrMsg("");
    }

    const handleStartEditResource = (index: number) => {
        setEditingResourceIndex(index);
    }

    const handleCancelResource = () => {
        setEditingResourceIndex(null);
    }

    const handleSaveResource = (resource: ClassResourceDTO, previewUrl: string) => {
        setResources((prev) => {
            let newList = [...prev];
            const resourceWithPreview: CreateClassResourceWithPreview = { ...resource, previewUrl };
            if (editingResourceIndex === -1) {
                newList.push(resourceWithPreview);
            } else if (editingResourceIndex !== null) {
                newList[editingResourceIndex] = resourceWithPreview;
            }
            return newList;
        });
        setEditingResourceIndex(null);
        setResourceErrMsg("");
    }

    const handleDeleteResource = (index: number) => {
        setResources((prev) => prev.filter((_, i) => i !== index));
        setResourceErrMsg("");
    }

    const submitSubclassForm: FormProps<CreateClassSubFormValues>['onFinish'] = async (values) => {
        let hasError = false;

        if (features.length === 0) {
            setFeatureErrMsg(t('classes.featureRequired'));
            hasError = true;
        }

        if (isSpellcaster && selectedSpellIds.length === 0) {
            setSpellErrMsg(t('classes.spellRequired'));
            hasError = true;
        }

        if (hasError) return;

        setSubmitLoad(true);

        try {

            let spellcastingProperties: SpellcastingProperties | null = null;

            spellcastingProperties = {
                spellcastingAbility: values.spellcastingAbility || "",
                preparationType: values.spellPreparationType || "",
                spellcastingType: values.spellcastingType || "",
                maxCantripKnown: maxCantripKnown,
                maxSpellKnown: values.spellPreparationType !== SpellPreparationTypeEnum.PREPARED ? maxSpellKnown : [],
                preparedLvlBonus: values.preparedLvlBonus ?? 0,
                preparedModBonus: !!values.preparedModBonus,
            };

            const payload: Omit<CreateClassSubDTO, 'workshopClassId'> = {
                image: imageUrl || undefined,
                name: values.name,
                description: values.description,
                spellcastingProperties: isSpellcaster ? spellcastingProperties : null,
                features: features,
                resources: resources.map(({ previewUrl, ...rest }) => rest),
                spellIds: isSpellcaster ? selectedSpellIds : [],
            };

            await onSubmit(payload);

            handleCancelForm();

        } finally {
            setSubmitLoad(false);
        }
    }

    return {
        subclassForm,
        submitLoad,
        isSpellcaster,
        diceSelection,
        spellcastingAbilitySelection,
        spellPreparationSelection,
        spellcastingTypeSelection,
        preparedLvlBonusSelection,
        maxKnownTotal,
        maxCantripKnown,
        maxSpellKnown,
        setIsSpellcaster,
        handleFileChange,
        submitSubclassForm,
        handleCancelForm,
        handleMaxKnownTotal,
        handleMaxCantripKnown,
        handleMaxSpellKnown,
        scrollRef,
        spellList,
        spellSearch,
        setSpellSearch,
        selectedSpellIds,
        handleToggleSpell,
        features,
        featureTypeSelection,
        handleStartAddFeature,
        handleDeleteFeature,
        editingFeatureIndex,
        handleStartEditFeature,
        handleCancelFeature,
        handleSaveFeature,
        featureErrMsg,
        spellErrMsg,
        resources,
        editingResourceIndex,
        resourceErrMsg,
        handleStartAddResource,
        handleStartEditResource,
        handleCancelResource,
        handleSaveResource,
        handleDeleteResource,
        handleApplyPreset,
        presets,
    }
}
