
import { useEffect, useState } from "react";

// api
import { workshopFeatApi } from "@/api";

// utils
import { SortEnum } from "@/utils/enums";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";
import useNotification from "@/hooks/global/useNotification";
import { useTranslation } from "react-i18next";

// interfaces
import type { CreateFeatDTO, Feat, UpdateWorkshopFeatDTO, WorkshopFeatReturn } from "@/models/featInterfaces";

export default function useWorkshopFeat() {

    const { t } = useTranslation();
    const { serverErrorModal, errorModal } = useStaticModal();
    const { successNotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(true);

    const [feats, setFeats] = useState<WorkshopFeatReturn[]>([]);
    const [filteredFeats, setFilteredFeats] = useState<WorkshopFeatReturn[]>([]);

    const [search, setSearch] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortValue, setSortValue] = useState<string>(SortEnum.RECENT);

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

    const [selectedFeatId, setSelectedFeatId] = useState<number | null>(null);
    const [editedFeatId, setEditedFeatId] = useState<number | null>(null);

    const [itemWidth, setItemWidth] = useState<string>(
        window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%'
    );

    useEffect(() => {
        getWorkshopFeatData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setItemWidth(window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setFilteredFeats(feats);
    }, [feats]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchValue(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (!searchValue) return setFilteredFeats(feats);

        let filtered = [...feats];

        if (searchValue) {
            filtered = filtered.filter((feat) =>
                feat.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        setFilteredFeats(filtered);
    }, [searchValue, feats]);

    useEffect(() => {
        if (sortValue === SortEnum.RECENT) {
            setFilteredFeats((prev) => [...prev].sort((a, b) => b.createdAt.toString().localeCompare(a.createdAt.toString())));
        }

        if (sortValue === SortEnum.ASC) {
            setFilteredFeats((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
        }

        if (sortValue === SortEnum.DESC) {
            setFilteredFeats((prev) => [...prev].sort((a, b) => b.name.localeCompare(a.name)));
        }
    }, [sortValue, searchValue, feats]);

    const getWorkshopFeatData = async () => {
        setLoading(true);

        try {
            const [error, res] = await workshopFeatApi.getFeats();

            if (error) {
                serverErrorModal();
                return;
            }

            setFeats(res);
            setFilteredFeats(res);

        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (value: string) => {
        setSearch(value);
    }

    const handleSort = (value: string) => {
        setSortValue(value);
    }

    const handleCreateModal = (value: boolean) => {
        setCreateModalOpen(value);
    }

    const handleSelectFeat = (featId: number | null) => {
        setSelectedFeatId(featId);
    }

    const handleGetFeatDetails = async (): Promise<Feat | null> => {
        return feats.find(
            (feat) => feat.workshopFeatId === selectedFeatId || feat.workshopFeatId === editedFeatId
        ) || null;
    }

    const handleEditFeatClick = (featId: number | null) => {
        setEditedFeatId(featId);
    }

    const handleCreateFeat = async (data: CreateFeatDTO): Promise<void> => {
        const [err, res] = await workshopFeatApi.createFeat(data);

        if (err) {
            if (err.status === 400) {
                const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                if (!error) return serverErrorModal();
                errorModal(undefined, `${error.field} is ${error.message}`);
                return;
            }

            serverErrorModal();
            return;
        }

        successNotification(t("feats.createSuccess"));

        uponCreated(res.workshopFeatId);
    }

    const uponCreated = async (workshopFeatId: number) => {

        const [err, res] = await workshopFeatApi.getOneFeat(workshopFeatId);

        if (err) {
            serverErrorModal();
            return;
        }

        if (sortValue === SortEnum.RECENT) {
            setFeats((prev) => [res, ...prev]);
            return;
        }

        setFeats((prev) => [...prev, res]);
    }

    const handleEditFeat = async (data: Feat, prevData: Feat): Promise<void> => {

        const isImageUpdated = data.image !== prevData.image;

        const updateData: UpdateWorkshopFeatDTO = {
            ...data,
            workshopFeatId: prevData.workshopFeatId || 0,
            isImageUpdated: isImageUpdated,
        };

        const [err, res] = await workshopFeatApi.editFeat(updateData);

        if (err) {
            if (err.status === 400) {
                const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                if (!error) return serverErrorModal();
                errorModal(undefined, `${error.field} is ${error.message}`);
                return;
            }

            serverErrorModal();
            return;
        }

        successNotification(t("feats.editSuccess"));

        uponEdited(res.workshopFeatId);
    }

    const uponEdited = async (workshopFeatId: number) => {

        const [err, res] = await workshopFeatApi.getOneFeat(workshopFeatId);

        if (err) {
            serverErrorModal();
            return;
        }

        setFeats((prev) => prev.map((feat) => feat.workshopFeatId === res.workshopFeatId ? res : feat));
    }

    const uponDelete = async (workshopFeatId: number) => {
        setFeats((prev) => prev.filter((feat) => feat.workshopFeatId !== workshopFeatId));
    }

    return {
        feats: filteredFeats,
        loading,
        search,
        sortValue,
        itemWidth,
        createModalOpen,
        selectedFeatId,
        editedFeatId,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleCreateFeat,
        handleSelectFeat,
        handleGetFeatDetails,
        handleEditFeatClick,
        handleEditFeat,
        uponDelete,
    }
}