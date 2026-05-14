import { useState, useEffect } from "react";

// utils
import { ClassDisplayTabEnum } from "@/utils/enums";

// api
import { workshopRaceApi, workshopSpellApi } from "@/api";

// hooks
import { useTranslation } from "react-i18next";
import useStaticModal from "@/hooks/global/useStaticModal";

// interfaces
import type { WorkshopRaceDetailReturn, Traits, AddTraitPayload, EditTraitPayload, DeleteTraitPayload } from "@/models/raceInterfaces";
import type { WorkshopSpellReturn } from "@/models/spellInterfaces";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

interface Props {
    workshopRaceId: number;
    open: boolean;
}

export default function useWorkshopRaceDisplayModal({ workshopRaceId, open }: Props) {

    const { serverErrorModal, confirmationModal } = useStaticModal();

    const { t } = useTranslation();

    const [workshopRace, setWorkshopRace] = useState<WorkshopRaceDetailReturn | null>(null);
    const [spells, setSpells] = useState<WorkshopSpellReturn[]>([]);
    const [activeTab, setActiveTab] = useState<string>(ClassDisplayTabEnum.OVERVIEW);

    const { classOptions } = useReferenceStore();
    const featureTypeSelection = classOptions.classFeatureType.map((type) => ({ label: t(`classes.${type}`), value: type }));

    const [editingTraitIndex, setEditingTraitIndex] = useState<number | null>(null); // null: none, -1: adding new
    const [traitToEdit, setTraitToEdit] = useState<Traits | null>(null);
    const [isSubmittingTrait, setIsSubmittingTrait] = useState<boolean>(false);

    const tabs: { key: string, label: string }[] = [
        { key: ClassDisplayTabEnum.OVERVIEW, label: t('classes.overview') },
        { key: ClassDisplayTabEnum.FEATURES, label: t('classes.traits') }, // Features refers to traits here
    ];

    if (workshopRace?.spells && workshopRace.spells.length > 0) {
        tabs.push({ key: ClassDisplayTabEnum.SPELLS, label: t('workshop.spells') });
    }

    useEffect(() => {
        if (!open) return;
        handleGetRaceData();
        handleGetSpells();
    }, [open, workshopRaceId]);

    useEffect(() => {
        if (!workshopRace) return;

        if (workshopRace.spells.length > 0) {
            tabs.push({ key: 'spells', label: t('workshop.spells') });
        }
    }, [workshopRace]);

    const handleGetRaceData = async (): Promise<void> => {
        const [err, res] = await workshopRaceApi.getDetailedRace(workshopRaceId);

        if (err) {
            serverErrorModal();
            return;
        }

        setWorkshopRace(res);
    }

    const handleGetSpells = async (): Promise<void> => {
        const [err, res] = await workshopSpellApi.getSpells();
        if (!err) {
            setSpells(res);
        }
    }

    const handleTabChange = (tab: string): void => {
        setActiveTab(tab);
    }

    const handleStartAddTrait = (): void => {
        setEditingTraitIndex(-1);
    }

    const handleStartEditTrait = (trait: Traits, index: number): void => {
        setEditingTraitIndex(index);
        setTraitToEdit(trait);
    }

    const handleCancelTrait = (): void => {
        setEditingTraitIndex(null);
        setTraitToEdit(null);
    }

    const handleAddTrait = async (trait: Traits): Promise<void> => {
        if (!workshopRace) return;
        setIsSubmittingTrait(true);

        const payload: AddTraitPayload = {
            workshopRaceId,
            trait
        };

        const [err] = await workshopRaceApi.addTrait(payload);
        if (err) {
            serverErrorModal();
        } else {
            await handleGetRaceData();
            handleCancelTrait();
        }
        setIsSubmittingTrait(false);
    }

    const handleEditTrait = async (newTrait: Traits): Promise<void> => {
        if (!workshopRace || !traitToEdit) return;
        setIsSubmittingTrait(true);

        const payload: EditTraitPayload = {
            workshopRaceId,
            currentTrait: traitToEdit,
            newTrait
        };

        const [err] = await workshopRaceApi.editTrait(payload);
        if (err) {
            serverErrorModal();
        } else {
            await handleGetRaceData();
            handleCancelTrait();
        }
        setIsSubmittingTrait(false);
    }

    const handleDeleteTrait = async (trait: Traits): Promise<void> => {
        if (!workshopRace) return;

        confirmationModal({
            title: t('global.delete'),
            content: t('items.deleteConfirmDesc'),
            centered: true,
            onOkWithPromise: async () => {
                const payload: DeleteTraitPayload = {
                    workshopRaceId,
                    trait
                };

                const [err] = await workshopRaceApi.deleteTrait(payload);
                if (err) {
                    serverErrorModal();
                } else {
                    await handleGetRaceData();
                }
            }
        });
    }

    // Check if any trait has a level > 1 to determine if we should show progression in forms
    const hasProgression = workshopRace?.traits?.some(t => t.level > 1) ?? false;

    return {
        workshopRace,
        activeTab,
        tabs,
        handleTabChange,
        editingTraitIndex,
        traitToEdit,
        featureTypeSelection,
        isSubmittingTrait,
        hasProgression,
        handleStartAddTrait,
        handleStartEditTrait,
        handleCancelTrait,
        handleAddTrait,
        handleEditTrait,
        handleDeleteTrait,
        spells,
    };
}
