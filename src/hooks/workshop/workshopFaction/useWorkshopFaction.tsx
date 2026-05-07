
import { useEffect, useState } from "react";

// api
import { workshopFactionApi } from "@/api";

// utils
import { SortEnum } from "@/utils/enums";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";
import useNotification from "@/hooks/global/useNotification";
import { useTranslation } from "react-i18next";

// interfaces
import type { CreateFactionDTO, Faction, UpdateWorkshopFactionDTO, WorkshopFactionReturn } from "@/models/factionInterfaces";

export default function useWorkshopFaction() {

    const { t } = useTranslation();
    const { serverErrorModal, errorModal } = useStaticModal();
    const { successNotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(true);

    const [factions, setFactions] = useState<WorkshopFactionReturn[]>([]);
    const [filteredFactions, setFilteredFactions] = useState<WorkshopFactionReturn[]>([]);

    const [search, setSearch] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortValue, setSortValue] = useState<string>(SortEnum.RECENT);

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

    const [selectedFactionId, setSelectedFactionId] = useState<number | null>(null);
    const [editedFactionId, setEditedFactionId] = useState<number | null>(null);

    const [itemWidth, setItemWidth] = useState<string>(
        window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%'
    );

    useEffect(() => {
        getWorkshopFactionData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setItemWidth(window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setFilteredFactions(factions);
    }, [factions]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchValue(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (!searchValue) return setFilteredFactions(factions);

        let filtered = [...factions];

        if (searchValue) {
            filtered = filtered.filter((faction) =>
                faction.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        setFilteredFactions(filtered);
    }, [searchValue, factions]);

    useEffect(() => {
        if (sortValue === SortEnum.RECENT) {
            setFilteredFactions((prev) => [...prev].sort((a, b) => b.createdAt.toString().localeCompare(a.createdAt.toString())));
        }

        if (sortValue === SortEnum.ASC) {
            setFilteredFactions((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
        }

        if (sortValue === SortEnum.DESC) {
            setFilteredFactions((prev) => [...prev].sort((a, b) => b.name.localeCompare(a.name)));
        }
    }, [sortValue, searchValue, factions]);

    const getWorkshopFactionData = async () => {
        setLoading(true);

        try {
            const [error, res] = await workshopFactionApi.getFactions();

            if (error) {
                serverErrorModal();
                return;
            }

            setFactions(res);
            setFilteredFactions(res);

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

    const handleSelectFaction = (factionId: number | null) => {
        setSelectedFactionId(factionId);
    }

    const handleGetFactionDetails = async (): Promise<Faction | null> => {
        return factions.find(
            (faction) => faction.workshopFactionId === selectedFactionId || faction.workshopFactionId === editedFactionId
        ) || null;
    }

    const handleEditFactionClick = (factionId: number | null) => {
        setEditedFactionId(factionId);
    }

    const handleCreateFaction = async (data: CreateFactionDTO): Promise<void> => {
        const [err, res] = await workshopFactionApi.createFaction(data);

        if (err) {
            if (err.status === 422) {
                const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                if (!error) return serverErrorModal();
                errorModal(undefined, `${error.field} is ${error.message}`);
                return;
            }

            serverErrorModal();
            return;
        }

        successNotification(t("factions.createSuccess"));

        uponCreated(res.workshopFactionId);
    }

    const uponCreated = async (workshopFactionId: number) => {
        const [err, res] = await workshopFactionApi.getOneFaction(workshopFactionId);

        if (err) {
            serverErrorModal();
            return;
        }

        setFactions((prev) => [res, ...prev]);
    }

    const handleEditFaction = async (data: Faction): Promise<void> => {

        const prevData = factions.find(faction => faction.workshopFactionId === editedFactionId) || null;
        if (!prevData) return;

        const isImageUpdated = data.image !== prevData.image;

        const updateData: UpdateWorkshopFactionDTO = {
            ...data,
            workshopFactionId: editedFactionId || 0,
            isImageUpdated: isImageUpdated,
        };

        const [err, res] = await workshopFactionApi.editFaction(updateData);

        if (err) {
            if (err.status === 422) {
                const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                if (!error) return serverErrorModal();
                errorModal(undefined, `${error.field} is ${error.message}`);
                return;
            }

            serverErrorModal();
            return;
        }

        successNotification(t("factions.editSuccess"));

        uponEdited(res.workshopFactionId);
    }

    const uponEdited = async (workshopFactionId: number) => {
        const [err, res] = await workshopFactionApi.getOneFaction(workshopFactionId);

        if (err) {
            serverErrorModal();
            return;
        }

        setFactions((prev) => prev.map((faction) => faction.workshopFactionId === res.workshopFactionId ? res : faction));
    }

    const uponDelete = async (workshopFactionId: number) => {
        setFactions((prev) => prev.filter((faction) => faction.workshopFactionId !== workshopFactionId));
    }

    return {
        factions: filteredFactions,
        loading,
        search,
        sortValue,
        itemWidth,
        createModalOpen,
        selectedFactionId,
        editedFactionId,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleCreateFaction,
        handleSelectFaction,
        handleGetFactionDetails,
        handleEditFactionClick,
        handleEditFaction,
        uponDelete,
    }
}
