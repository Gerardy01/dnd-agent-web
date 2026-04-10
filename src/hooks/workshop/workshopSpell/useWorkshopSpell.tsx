import { useEffect, useState } from "react";

// api
import { workshopSpellApi } from "@/api";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";

// utils
import { SortEnum } from "@/utils/enums";

// interfaces
import type { CreateSpellDTO, UpdateWorkshopSpellDTO, WorkshopSpellReturn } from "@/models/spellInterfaces";
import useNotification from "@/hooks/global/useNotification";
import { useTranslation } from "react-i18next";

export default function useWorkshopSpell() {
    const { t } = useTranslation();
    const { serverErrorModal, errorModal } = useStaticModal();
    const { successNotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(true);

    const [workshopSpells, setWorkshopSpells] = useState<WorkshopSpellReturn[]>([]);
    const [filteredWorkshopSpells, setFilteredWorkshopSpells] = useState<WorkshopSpellReturn[]>([]);

    const [search, setSearch] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortValue, setSortValue] = useState<string>(SortEnum.RECENT);

    const [attackFilter, setAttackFilter] = useState<string>("all");
    const [minLevel, setMinLevel] = useState<number | null>(null);
    const [maxLevel, setMaxLevel] = useState<number | null>(null);

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

    const [selectedSpellId, setSelectedSpellId] = useState<number | null>(null);
    const [editedSpellId, setEditedSpellId] = useState<number | null>(null);

    const [spellWidth, setSpellWidth] = useState<string>(
        window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%'
    );

    useEffect(() => {
        getWorkshopSpellData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setSpellWidth(window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setFilteredWorkshopSpells(workshopSpells);
    }, [workshopSpells]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchValue(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (
            !searchValue &&
            attackFilter === "all" &&
            minLevel === 0 &&
            maxLevel === 9
        ) return setFilteredWorkshopSpells(workshopSpells);

        let filtered = [...workshopSpells];

        if (searchValue) {
            filtered = filtered.filter((spell: WorkshopSpellReturn) =>
                spell.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        if (attackFilter === "attack") {
            filtered = filtered.filter((spell: WorkshopSpellReturn) => spell.attackProperties !== null);
        }

        if (attackFilter === "non-attack") {
            filtered = filtered.filter((spell: WorkshopSpellReturn) => spell.attackProperties === null);
        }

        filtered = filtered.filter((spell: WorkshopSpellReturn) => spell.level >= (minLevel ?? 0) && spell.level <= (maxLevel ?? 9));

        setFilteredWorkshopSpells(filtered);
    }, [searchValue, attackFilter, minLevel, maxLevel, workshopSpells]);

    useEffect(() => {
        if (sortValue === SortEnum.RECENT) {
            setFilteredWorkshopSpells((prev: WorkshopSpellReturn[]) => [...prev].sort((a, b) => b.createdAt.toString().localeCompare(a.createdAt.toString())));
        }

        if (sortValue === SortEnum.ASC) {
            setFilteredWorkshopSpells((prev: WorkshopSpellReturn[]) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
        }

        if (sortValue === SortEnum.DESC) {
            setFilteredWorkshopSpells((prev: WorkshopSpellReturn[]) => [...prev].sort((a, b) => b.name.localeCompare(a.name)));
        }
    }, [sortValue, searchValue, attackFilter, minLevel, maxLevel, workshopSpells]);

    const getWorkshopSpellData = async () => {
        setLoading(true);

        try {
            const [error, res] = await workshopSpellApi.getSpells();

            if (error) {
                serverErrorModal();
                return;
            }

            setWorkshopSpells(res);
            setFilteredWorkshopSpells(res);

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

    const handleAttackFilter = (value: string) => {
        setAttackFilter(value);
    }

    const handleMinLevel = (value: number) => {
        setMinLevel(value);
    }

    const handleMaxLevel = (value: number) => {
        setMaxLevel(value);
    }

    const handleCreateModal = (value: boolean) => {
        setCreateModalOpen(value);
    }

    const resetFilters = () => {
        setAttackFilter("all");
        setMinLevel(null);
        setMaxLevel(null);
    }

    const handleSelectSpell = (spellId: number | null) => {
        setSelectedSpellId(spellId);
    }

    const handleGetSpellDetails = async (): Promise<WorkshopSpellReturn | null> => {
        return workshopSpells.find(
            (spell) => spell.workshopSpellId === selectedSpellId || spell.workshopSpellId === editedSpellId
        ) || null;
    }

    const handleEditSpellClick = (spellId: number | null) => {
        setEditedSpellId(spellId);
    }

    const handleEditSpell = async (data: WorkshopSpellReturn, prevData: WorkshopSpellReturn): Promise<void> => {
        const isImageUpdated = data.image !== prevData.image;

        const { image, workshopSpellId, ...rest } = data;

        const updateData: UpdateWorkshopSpellDTO = {
            ...rest,
            workshopSpellId: prevData.workshopSpellId || 0,
            isImageUpdated: isImageUpdated,
            image: image || undefined,
        }

        const [err, res] = await workshopSpellApi.editSpell(updateData);

        if (err) {
            if (err.status === 400) {
                const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                if (!error) return;
                errorModal(undefined, `${error.field} is ${error.message}`);
                return;
            }

            serverErrorModal();
            return;
        }

        successNotification(t("spells.editSuccess"));

        uponEdited(res.workshopSpellId);
    }

    const uponCreated = async (workshopSpellId: number) => {
        const [err, res] = await workshopSpellApi.getOneSpell(workshopSpellId);

        if (err) {
            serverErrorModal();
            return;
        }

        if (sortValue === SortEnum.RECENT) {
            setWorkshopSpells((prev: WorkshopSpellReturn[]) => [res, ...prev]);
            return;
        }

        setWorkshopSpells((prev: WorkshopSpellReturn[]) => [...prev, res]);
    }

    const handleCreateSpell = async (data: CreateSpellDTO): Promise<void> => {
        const [err, res] = await workshopSpellApi.createSpell(data);

        if (err) {
            if (err.status === 400) {
                const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                if (!error) return;
                errorModal(undefined, `${error.field} is ${error.message}`);
                return;
            }

            serverErrorModal();
            return;
        }

        successNotification(t("spells.createSuccess"));
        uponCreated(res.workshopSpellId);
    }

    const uponEdited = async (workshopSpellId: number) => {
        const [err, res] = await workshopSpellApi.getOneSpell(workshopSpellId);

        if (err) {
            serverErrorModal();
            return;
        }

        if (sortValue === SortEnum.RECENT) {
            setWorkshopSpells((prev: WorkshopSpellReturn[]) => prev.map((s) => s.workshopSpellId === res.workshopSpellId ? res : s));
            return;
        }

        setWorkshopSpells((prev: WorkshopSpellReturn[]) => prev.map((s) => s.workshopSpellId === res.workshopSpellId ? res : s));
    }

    const uponDelete = async (workshopSpellId: number) => {
        setWorkshopSpells((prev: WorkshopSpellReturn[]) => prev.filter((spell: WorkshopSpellReturn) => spell.workshopSpellId !== workshopSpellId));
    }

    return {
        spells: filteredWorkshopSpells,
        loading,
        search,
        sortValue,
        attackFilter,
        minLevel,
        maxLevel,
        spellWidth,
        createModalOpen,
        selectedSpellId,
        editedSpellId,
        handleSearch,
        handleSort,
        handleAttackFilter,
        handleMinLevel,
        handleMaxLevel,
        handleCreateModal,
        resetFilters,
        uponDelete,
        handleCreateSpell,
        handleSelectSpell,
        handleGetSpellDetails,
        handleEditSpellClick,
        handleEditSpell,
    }
}
