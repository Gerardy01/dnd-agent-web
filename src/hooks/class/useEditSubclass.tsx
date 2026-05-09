import { useEffect, useRef, useState } from "react";
import { Form, type FormProps } from "antd";
import { useTranslation } from "react-i18next";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// utils
import { SpellPreparationTypeEnum } from "@/utils/enums";

// interfaces
import type { UpdateClassSubDTO, SpellcastingProperties, MaxKnown, Features, ClassResourceDTO, WorkshopClassSubDetailDataReturn } from "@/models/classInterfaces";
import type { WorkshopSpellReturn } from "@/models/spellInterfaces";
import type { PresetMaxKnown } from "@/models/referenceInterfaces";

export interface CreateClassResourceWithPreview extends ClassResourceDTO {
    previewUrl?: string;
}

interface SpellGroup {
    level: number;
    spells: WorkshopSpellReturn[];
}

interface EditSubclassFormValues {
    name: string;
    description: string;
    spellcastingAbility?: string;
    spellPreparationType?: string;
    spellcastingType?: string;
    preparedLvlBonus: number;
    preparedModBonus: boolean;
}

export default function useEditSubclass(
    subclassData: WorkshopClassSubDetailDataReturn | null,
    onCancel: () => void,
    onEditSubmit: (data: UpdateClassSubDTO) => Promise<void>,
    spells: WorkshopSpellReturn[]
) {
    const { t } = useTranslation();
    const [editSubclassForm] = Form.useForm();
    const { classOptions } = useReferenceStore();

    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const [isSpellcaster, setIsSpellcaster] = useState<boolean>(false);
    const [features, setFeatures] = useState<Features[]>([]);
    const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);
    const [featureErrMsg, setFeatureErrMsg] = useState<string>('');
    const [spellErrMsg, setSpellErrMsg] = useState<string>('');

    const [resources, setResources] = useState<CreateClassResourceWithPreview[]>([]);
    const [editingResourceIndex, setEditingResourceIndex] = useState<number | null>(null);
    const [resourceErrMsg, setResourceErrMsg] = useState<string>('');

    const [spellSearch, setSpellSearch] = useState<string>('');
    const [selectedSpellIds, setSelectedSpellIds] = useState<number[]>([]);

    const [maxKnownTotal, setMaxKnownTotal] = useState<number>(20);
    const [maxCantripKnown, setMaxCantripKnown] = useState<MaxKnown[]>([...Array(maxKnownTotal)].map((_, i) => ({ level: i + 1, amount: 0 })));
    const [maxSpellKnown, setMaxSpellKnown] = useState<MaxKnown[]>([...Array(maxKnownTotal)].map((_, i) => ({ level: i + 1, amount: 0 })));

    const scrollRef = useRef<HTMLDivElement>(null);

    // Removed internal fetching useEffect

    useEffect(() => {
        if (!subclassData) return;

        editSubclassForm.setFieldsValue({
            name: subclassData.name,
            description: subclassData.description,
            spellcastingAbility: subclassData.spellcastingProperties?.spellcastingAbility,
            spellPreparationType: subclassData.spellcastingProperties?.preparationType,
            spellcastingType: subclassData.spellcastingProperties?.spellcastingType,
            preparedLvlBonus: subclassData.spellcastingProperties?.preparedLvlBonus || 0,
            preparedModBonus: subclassData.spellcastingProperties?.preparedModBonus || false,
        });

        setImageUrl(subclassData.image || "");
        setIsSpellcaster(!!subclassData.spellcastingProperties);
        setFeatures(subclassData.features || []);
        setResources(subclassData.resources.map(r => ({ ...r, previewUrl: r.image || "" })) || []);
        setSelectedSpellIds(subclassData.spells.map((s) => s.workshopSpellId) || []);

        if (subclassData.spellcastingProperties) {
            const maxKnownCount = subclassData.spellcastingProperties.maxCantripKnown.length;
            setMaxKnownTotal(maxKnownCount);
            setMaxCantripKnown(subclassData.spellcastingProperties.maxCantripKnown);
            setMaxSpellKnown(subclassData.spellcastingProperties.maxSpellKnown.length > 0 ? subclassData.spellcastingProperties.maxSpellKnown : [...Array(maxKnownCount)].map((_, i) => ({ level: i + 1, amount: 0 })));
        }

    }, [subclassData, editSubclassForm]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: scrollRef.current.scrollWidth,
                behavior: 'smooth'
            });
        }
    }, [maxKnownTotal]);

    // Removed getInitialData function

    const spellcastingAbilitySelection = classOptions.spellcastingAbility.map((ability) => ({ label: t(`items.${ability}`), value: ability }));
    const spellPreparationSelection = classOptions.spellPreparationType.map((prep) => ({ label: t(`classes.${prep}`), value: prep }));
    const spellcastingTypeSelection = classOptions.spellcastingType.map((type) => ({ label: t(`classes.${type}`), value: type }));
    const featureTypeSelection = classOptions.classFeatureType.map((type) => ({ label: t(`classes.${type}`), value: type }));

    const preparedLvlBonusSelection = [
        { label: t('classes.noLevelBonus'), value: 0 },
        { label: t('classes.halfLevelBonus'), value: 50 },
        { label: t('classes.fullLevelBonus'), value: 100 },
    ];

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

    const handleFileChange = (url: string): void => {
        setImageUrl(url);
    };

    const handleCancelForm = (): void => {
        onCancel();
    };

    const handleMaxKnownTotal = (newValue: number): void => {
        setMaxKnownTotal(newValue);
        setMaxCantripKnown(prev => {
            const next = [...Array(newValue)].map((_, i) => ({ level: i + 1, amount: 0 }));
            prev.forEach((item, i) => { if (i < newValue) next[i] = item; });
            return next;
        });
        setMaxSpellKnown(prev => {
            const next = [...Array(newValue)].map((_, i) => ({ level: i + 1, amount: 0 }));
            prev.forEach((item, i) => { if (i < newValue) next[i] = item; });
            return next;
        });
    };

    const handleMaxCantripKnown = (index: number, amount: number): void => {
        setMaxCantripKnown((prev) => {
            const newState = [...prev];
            newState[index] = { ...newState[index], amount };
            return newState;
        });
    };

    const handleMaxSpellKnown = (index: number, amount: number): void => {
        setMaxSpellKnown((prev) => {
            const newState = [...prev];
            newState[index] = { ...newState[index], amount };
            return newState;
        });
    };

    const nonSpellcasterPreset: PresetMaxKnown = {
        name: "nonSpellcaster",
        maxCantripKnown: Array(20).fill(0),
        maxSpellKnown: Array(20).fill(0)
    };

    const presets: PresetMaxKnown[] = [nonSpellcasterPreset, ...classOptions.presetMaxKnown];

    const handleApplyPreset = (preset: PresetMaxKnown): void => {
        setMaxCantripKnown(preset.maxCantripKnown.map((amount, i) => ({ level: i + 1, amount })));
        setMaxSpellKnown(preset.maxSpellKnown.map((amount, i) => ({ level: i + 1, amount })));
        setMaxKnownTotal(preset.maxCantripKnown.length);
    };

    const handleToggleSpell = (spellId: number): void => {
        setSelectedSpellIds((prev) =>
            prev.includes(spellId) ? prev.filter((id) => id !== spellId) : [...prev, spellId]
        );
        setSpellErrMsg("");
    };

    const handleStartAddFeature = (): void => {
        setEditingFeatureIndex(-1);
        setFeatureErrMsg("");
    };

    const handleStartEditFeature = (index: number): void => {
        setEditingFeatureIndex(index);
    };

    const handleCancelFeature = (): void => {
        setEditingFeatureIndex(null);
    };

    const handleSaveFeature: FormProps<Features>['onFinish'] = async (feature) => {
        setFeatures((prev) => {
            const newList = [...prev];
            if (editingFeatureIndex === -1) {
                newList.push(feature);
            } else if (editingFeatureIndex !== null) {
                newList[editingFeatureIndex] = feature;
            }
            return newList.sort((a, b) => a.level - b.level);
        });
        setEditingFeatureIndex(null);
        setFeatureErrMsg("");
    };

    const handleDeleteFeature = (index: number): void => {
        setFeatures((prev) => prev.filter((_, i) => i !== index));
        setFeatureErrMsg("");
    };

    const handleStartAddResource = (): void => {
        setEditingResourceIndex(-1);
        setResourceErrMsg("");
    };

    const handleStartEditResource = (index: number): void => {
        setEditingResourceIndex(index);
    };

    const handleCancelResource = (): void => {
        setEditingResourceIndex(null);
    };

    const handleSaveResource = (resource: ClassResourceDTO, previewUrl: string): void => {
        setResources((prev) => {
            const newList = [...prev];
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
    };

    const handleDeleteResource = (index: number): void => {
        setResources((prev) => prev.filter((_, i) => i !== index));
        setResourceErrMsg("");
    };

    const submitEditSubclass: FormProps<EditSubclassFormValues>['onFinish'] = async (values) => {
        if (!subclassData) return;
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
            const spellcastingProperties: SpellcastingProperties | null = isSpellcaster ? {
                spellcastingAbility: values.spellcastingAbility || "",
                preparationType: values.spellPreparationType || "",
                spellcastingType: values.spellcastingType || "",
                maxCantripKnown: maxCantripKnown,
                maxSpellKnown: values.spellPreparationType !== SpellPreparationTypeEnum.PREPARED ? maxSpellKnown : [],
                preparedLvlBonus: values.preparedLvlBonus ?? 0,
                preparedModBonus: !!values.preparedModBonus,
            } : null;

            const isImageUpdated = subclassData.image !== imageUrl;

            const submitData: UpdateClassSubDTO = {
                id: subclassData.id,
                workshopClassId: subclassData.workshopClassId,
                image: imageUrl || undefined,
                name: values.name,
                description: values.description,
                spellcastingProperties,
                features,
                resources: resources.map(({ previewUrl, ...rest }) => rest),
                spellIds: isSpellcaster ? selectedSpellIds : [],
                isImageUpdated,
            };

            await onEditSubmit(submitData);
            handleCancelForm();
        } finally {
            setSubmitLoad(false);
        }
    };

    return {
        subclassData,
        editSubclassForm,
        submitLoad,
        isSpellcaster,
        spellcastingAbilitySelection,
        spellPreparationSelection,
        spellcastingTypeSelection,
        preparedLvlBonusSelection,
        maxKnownTotal,
        maxCantripKnown,
        maxSpellKnown,
        setIsSpellcaster,
        handleFileChange,
        submitEditSubclass,
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
    };
}
