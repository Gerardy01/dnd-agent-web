import { useState, useEffect } from "react";
import { Form, type FormProps } from "antd";
import { useTranslation } from "react-i18next";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// interfaces
import type { RaceWrite, Traits, SpellcastingProperties, WorkshopRaceDetailReturn } from "@/models/raceInterfaces";
import type { WorkshopSpellReturn } from "@/models/spellInterfaces";

interface SpellGroup {
    level: number;
    spells: WorkshopSpellReturn[];
}

interface EditRaceFormValues {
    name: string;
    description: string;
    speed: number;
    language: string;
    spellcastingAbility?: string;
}

export default function useEditRace(
    onClose: () => void,
    onSubmit: (data: RaceWrite) => Promise<void>,
    getData: () => Promise<WorkshopRaceDetailReturn | null>,
    spells: WorkshopSpellReturn[]
) {

    const { t } = useTranslation();
    const [editRaceForm] = Form.useForm();

    const { classOptions } = useReferenceStore();

    const [raceData, setRaceData] = useState<WorkshopRaceDetailReturn | null>(null);
    const [submitLoad, setSubmitLoad] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const [isSpellcaster, setIsSpellcaster] = useState<boolean>(false);

    const [traits, setTraits] = useState<Traits[]>([]);
    const [editingTraitIndex, setEditingTraitIndex] = useState<number | null>(null); // null: none, -1: adding new

    const [traitErrMsg, setTraitErrMsg] = useState<string>('');
    const [spellErrMsg, setSpellErrMsg] = useState<string>('');

    const [hasProgression, setHasProgression] = useState<boolean>(false);

    const [spellSearch, setSpellSearch] = useState<string>('');
    const [selectedSpellIds, setSelectedSpellIds] = useState<number[]>([]);

    useEffect(() => {
        getInitialData();
    }, []);

    useEffect(() => {
        if (!raceData) return;

        editRaceForm.setFieldsValue({
            name: raceData.name,
            description: raceData.description,
            speed: raceData.speed,
            language: raceData.language,
            spellcastingAbility: raceData.spellcastingProperties?.spellcastingAbility,
        });

        setImageUrl(raceData.image || "");
        setIsSpellcaster(!!raceData.spellcastingProperties);
        setTraits(raceData.traits || []);
        setSelectedSpellIds(raceData.spells.map((s) => s.workshopSpellId) || []);
        
        // If any trait has level > 1, progression is active
        setHasProgression(raceData.traits.some((t) => t.level > 1));

    }, [raceData, editRaceForm]);

    const getInitialData = async (): Promise<void> => {
        const data = await getData();
        setRaceData(data);
    };

    const spellcastingAbilitySelection = classOptions.spellcastingAbility.map((ability) => ({ label: t(`items.${ability}`), value: ability }));
    const featureTypeSelection = classOptions.classFeatureType.map((type) => ({ label: t(`classes.${type}`), value: type }));

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


    const handleFileChange = (url: string) => {
        setImageUrl(url);
    }

    const handleCloseModal = () => {
        onClose();
    }

    const handleToggleSpell = (spellId: number) => {
        setSelectedSpellIds((prev) =>
            prev.includes(spellId) ? prev.filter((id) => id !== spellId) : [...prev, spellId]
        );
        setSpellErrMsg("");
    }

    const handleStartAddTrait = () => {
        setEditingTraitIndex(-1);
        setTraitErrMsg("");
    }

    const handleStartEditTrait = (index: number) => {
        setEditingTraitIndex(index);
    }

    const handleCancelTrait = () => {
        setEditingTraitIndex(null);
    }

    const handleSaveTrait: FormProps<Traits>['onFinish'] = async (trait) => {
        setTraits((prev) => {
            let newList = [...prev];
            if (editingTraitIndex === -1) {
                newList.push(trait);
            } else if (editingTraitIndex !== null) {
                newList[editingTraitIndex] = trait;
            }
            return newList;
        });
        setEditingTraitIndex(null);
        setTraitErrMsg("");
    }

    const handleDeleteTrait = (index: number) => {
        setTraits((prev) => prev.filter((_, i) => i !== index));
        setTraitErrMsg("");
    }


    const submitEditRace: FormProps<EditRaceFormValues>['onFinish'] = async (values) => {
        let hasError = false;

        if (traits.length === 0) {
            setTraitErrMsg(t('races.traitRequired'));
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

            if (isSpellcaster) {
                spellcastingProperties = {
                    spellcastingAbility: values.spellcastingAbility || "",
                };
            }

            const payload: RaceWrite = {
                image: imageUrl || null,
                name: values.name,
                description: values.description,
                speed: values.speed,
                language: values.language,
                spellcastingProperties: isSpellcaster ? spellcastingProperties : null,
                traits: hasProgression ? traits : traits.map(t => ({ ...t, level: 1 })),
                spellIds: isSpellcaster ? selectedSpellIds : [],
            };

            await onSubmit(payload);

            handleCloseModal();

        } finally {
            setSubmitLoad(false);
        }
    }

    return {
        raceData,
        editRaceForm,
        submitLoad,
        isSpellcaster,
        spellcastingAbilitySelection,
        setIsSpellcaster,
        handleFileChange,
        submitEditRace,
        handleCloseModal,
        spellList,
        spellSearch,
        setSpellSearch,
        selectedSpellIds,
        handleToggleSpell,
        traits,
        featureTypeSelection,
        handleStartAddTrait,
        handleDeleteTrait,
        editingTraitIndex,
        handleStartEditTrait,
        handleCancelTrait,
        handleSaveTrait,
        traitErrMsg,
        spellErrMsg,
        hasProgression,
        setHasProgression,
    }
}
