import { useState, useEffect } from "react";

// utils
import { ClassDisplayTabEnum } from "@/utils/enums";

// api
import { workshopClassApi } from "@/api";

// hooks
import { useTranslation } from "react-i18next";
import useStaticModal from "@/hooks/global/useStaticModal";

// interfaces
import type { WorkshopClassDetailReturn, Features, AddFeaturePayload, EditFeaturePayload, DeleteFeaturePayload, ClassResourceReturn, ClassResourceDTO, AddResourcePayload, EditResourcePayload, DeleteResourcePayload } from "@/models/classInterfaces";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

interface Props {
    workshopClassId: number;
    open: boolean;
}

export default function useWorkshopClassDisplayModal({ workshopClassId, open }: Props) {

    const { serverErrorModal, confirmationModal } = useStaticModal();

    const { t } = useTranslation();

    const [workshopClass, setWorkshopClass] = useState<WorkshopClassDetailReturn | null>(null);
    const [activeTab, setActiveTab] = useState<string>(ClassDisplayTabEnum.OVERVIEW);

    const { classOptions } = useReferenceStore();
    const featureTypeSelection = classOptions.classFeatureType.map((type) => ({ label: t(`classes.${type}`), value: type }));

    const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null); // null: none, -1: adding new
    const [featureToEdit, setFeatureToEdit] = useState<Features | null>(null);
    const [isSubmittingFeature, setIsSubmittingFeature] = useState<boolean>(false);

    const [editingResourceIndex, setEditingResourceIndex] = useState<number | null>(null); // null: none, -1: adding new
    const [resourceToEdit, setResourceToEdit] = useState<ClassResourceReturn | null>(null);
    const [isSubmittingResource, setIsSubmittingResource] = useState<boolean>(false);

    const tabs: { key: string, label: string }[] = [
        { key: ClassDisplayTabEnum.OVERVIEW, label: t('classes.overview') },
        { key: ClassDisplayTabEnum.FEATURES, label: t('classes.features') },
        { key: ClassDisplayTabEnum.RESOURCES, label: t('classes.resources') },
    ];

    if (workshopClass?.spells && workshopClass.spells.length > 0) {
        tabs.push({ key: ClassDisplayTabEnum.SPELLS, label: t('workshop.spells') });
    }

    useEffect(() => {
        if (!open) return;
        handleGetClassData();
    }, [open, workshopClassId]);

    useEffect(() => {
        if (!workshopClass) return;

        if (workshopClass.spells.length > 0) {
            tabs.push({ key: 'spells', label: t('workshop.spells') });
        }
    }, [workshopClass])

    const handleGetClassData = async (): Promise<void> => {
        const [err, res] = await workshopClassApi.getDetailedClass(workshopClassId);

        if (err) {
            serverErrorModal();
            return;
        }

        setWorkshopClass(res);
    }

    const handleTabChange = (tab: string): void => {
        setActiveTab(tab);
    }

    const handleStartAddFeature = (): void => {
        setEditingFeatureIndex(-1);
    }

    const handleStartEditFeature = (feature: Features, index: number): void => {
        setEditingFeatureIndex(index);
        setFeatureToEdit(feature);
    }

    const handleCancelFeature = (): void => {
        setEditingFeatureIndex(null);
        setFeatureToEdit(null);
    }

    const handleAddFeature = async (feature: Features): Promise<void> => {
        if (!workshopClass) return;
        setIsSubmittingFeature(true);

        const payload: AddFeaturePayload = {
            workshopClassId,
            feature
        };

        const [err] = await workshopClassApi.addFeature(payload);
        if (err) {
            serverErrorModal();
        } else {
            await handleGetClassData();
            handleCancelFeature();
        }
        setIsSubmittingFeature(false);
    }

    const handleEditFeature = async (newFeature: Features): Promise<void> => {
        if (!workshopClass || !featureToEdit) return;
        setIsSubmittingFeature(true);

        const payload: EditFeaturePayload = {
            workshopClassId,
            currentFeature: featureToEdit,
            newFeature
        };

        const [err] = await workshopClassApi.editFeature(payload);
        if (err) {
            serverErrorModal();
        } else {
            await handleGetClassData();
            handleCancelFeature();
        }
        setIsSubmittingFeature(false);
    }

    const handleDeleteFeature = async (feature: Features): Promise<void> => {
        if (!workshopClass) return;

        confirmationModal({
            title: t('global.delete'),
            content: t('items.deleteConfirmDesc'),
            centered: true,
            onOkWithPromise: async () => {
                const payload: DeleteFeaturePayload = {
                    workshopClassId,
                    feature
                };

                const [err] = await workshopClassApi.deleteFeature(payload);
                if (err) {
                    serverErrorModal();
                } else {
                    await handleGetClassData();
                }
            }
        });
    }

    const handleStartAddResource = (): void => {
        setEditingResourceIndex(-1);
    }

    const handleStartEditResource = (resource: ClassResourceReturn, index: number): void => {
        setEditingResourceIndex(index);
        setResourceToEdit(resource);
    }

    const handleCancelResource = (): void => {
        setEditingResourceIndex(null);
        setResourceToEdit(null);
    }

    const handleAddResource = async (resource: ClassResourceDTO): Promise<void> => {
        if (!workshopClass) return;
        setIsSubmittingResource(true);

        const payload: AddResourcePayload = {
            workshopClassId,
            resource
        };

        const [err] = await workshopClassApi.addResource(payload);
        if (err) {
            serverErrorModal();
        } else {
            await handleGetClassData();
            handleCancelResource();
        }
        setIsSubmittingResource(false);
    }

    const handleEditResource = async (resource: ClassResourceDTO): Promise<void> => {
        if (!workshopClass || !resourceToEdit) return;
        setIsSubmittingResource(true);

        const payload: EditResourcePayload = {
            workshopClassId,
            classResourceId: resourceToEdit.id,
            resource
        };

        const [err] = await workshopClassApi.editResource(payload);
        if (err) {
            serverErrorModal();
        } else {
            await handleGetClassData();
            handleCancelResource();
        }
        setIsSubmittingResource(false);
    }

    const handleDeleteResource = async (resourceId: number): Promise<void> => {
        if (!workshopClass) return;

        confirmationModal({
            title: t('global.delete'),
            content: t('items.deleteConfirmDesc'),
            centered: true,
            onOkWithPromise: async () => {
                const payload: DeleteResourcePayload = {
                    workshopClassId,
                    classResourceId: resourceId
                };

                const [err] = await workshopClassApi.deleteResource(payload);
                if (err) {
                    serverErrorModal();
                } else {
                    await handleGetClassData();
                }
            }
        });
    }

    return {
        workshopClass,
        activeTab,
        tabs,
        handleTabChange,
        editingFeatureIndex,
        featureToEdit,
        featureTypeSelection,
        isSubmittingFeature,
        handleStartAddFeature,
        handleStartEditFeature,
        handleCancelFeature,
        handleAddFeature,
        handleEditFeature,
        handleDeleteFeature,
        editingResourceIndex,
        resourceToEdit,
        isSubmittingResource,
        handleStartAddResource,
        handleStartEditResource,
        handleCancelResource,
        handleAddResource,
        handleEditResource,
        handleDeleteResource,
    };
}
