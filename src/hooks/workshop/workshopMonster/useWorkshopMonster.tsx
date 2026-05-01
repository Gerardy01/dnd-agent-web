import { useEffect, useState } from "react";

// api
import { workshopMonsterApi } from "@/api";

// utils
import { SortEnum } from "@/utils/enums";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";
import useNotification from "@/hooks/global/useNotification";
import { useTranslation } from "react-i18next";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// interfaces
import type { CreateMonsterDTO, Monster, UpdateWorkshopMonsterDTO } from "@/models/monsterInterfaces";

export default function useWorkshopMonster() {

    const { t } = useTranslation();
    const { serverErrorModal, errorModal } = useStaticModal();
    const { successNotification } = useNotification();

    const { monsterOptions } = useReferenceStore();

    const [loading, setLoading] = useState<boolean>(true);

    const [workshopMonsters, setWorkshopMonsters] = useState<Monster[]>([]);
    const [filteredWorkshopMonsters, setFilteredWorkshopMonsters] = useState<Monster[]>([]);

    const [search, setSearch] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortValue, setSortValue] = useState<string>(SortEnum.RECENT);
    const [sizeFilterValue, setSizeFilterValue] = useState<string[]>([]);
    const [typeFilterValue, setTypeFilterValue] = useState<string[]>([]);
    const [alignmentFilterValue, setAlignmentFilterValue] = useState<string[]>([]);

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

    const [selectedMonsterId, setSelectedMonsterId] = useState<number | null>(null);
    const [editedMonsterId, setEditedMonsterId] = useState<number | null>(null);

    const [monsterWidth, setMonsterWidth] = useState<string>(
        window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%'
    );

    const sizeSelection = monsterOptions.monsterSize.map((size) => ({
        label: t(`monsters.${size}`),
        value: size,
    }));

    const typeSelection = monsterOptions.monsterType.map((type) => ({
        label: t(`monsters.${type}`),
        value: type,
    }));

    const alignmentSelection = monsterOptions.alignment.map((alignment) => ({
        label: t(`monsters.${alignment}`),
        value: alignment,
    }));

    useEffect(() => {
        getWorkshopMonsterData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setMonsterWidth(window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setFilteredWorkshopMonsters(workshopMonsters);
    }, [workshopMonsters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchValue(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (
            !searchValue &&
            sizeFilterValue.length === 0 &&
            typeFilterValue.length === 0 &&
            alignmentFilterValue.length === 0
        ) return setFilteredWorkshopMonsters(workshopMonsters);

        let filtered = [...workshopMonsters];

        if (searchValue) {
            filtered = filtered.filter((monster) =>
                monster.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        if (sizeFilterValue.length > 0) {
            filtered = filtered.filter((monster) =>
                sizeFilterValue.includes(monster.size)
            );
        }

        if (typeFilterValue.length > 0) {
            filtered = filtered.filter((monster) =>
                typeFilterValue.includes(monster.type)
            );
        }

        if (alignmentFilterValue.length > 0) {
            filtered = filtered.filter((monster) =>
                alignmentFilterValue.includes(monster.alignment)
            );
        }

        setFilteredWorkshopMonsters(filtered);
    }, [searchValue, sizeFilterValue, typeFilterValue, alignmentFilterValue]);

    useEffect(() => {
        if (sortValue === SortEnum.RECENT) {
            setFilteredWorkshopMonsters((prev) => [...prev].sort((a, b) => b.createdAt.toString().localeCompare(a.createdAt.toString())));
        }

        if (sortValue === SortEnum.ASC) {
            setFilteredWorkshopMonsters((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
        }

        if (sortValue === SortEnum.DESC) {
            setFilteredWorkshopMonsters((prev) => [...prev].sort((a, b) => b.name.localeCompare(a.name)));
        }
    }, [sortValue, searchValue, sizeFilterValue, typeFilterValue, alignmentFilterValue]);

    const getWorkshopMonsterData = async () => {
        setLoading(true);

        try {
            const [error, res] = await workshopMonsterApi.getMonsters();

            if (error) {
                serverErrorModal();
                return;
            }

            setWorkshopMonsters(res);
            setFilteredWorkshopMonsters(res);

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

    const handleSizeFilter = (value: string[]) => {
        setSizeFilterValue(value);
    }

    const handleTypeFilter = (value: string[]) => {
        setTypeFilterValue(value);
    }

    const handleAlignmentFilter = (value: string[]) => {
        setAlignmentFilterValue(value);
    }

    const handleSelectMonster = (monsterId: number | null) => {
        setSelectedMonsterId(monsterId);
    }

    const handleGetMonsterDetails = async (): Promise<Monster | null> => {
        return workshopMonsters.find(
            (monster) => monster.workshopMonsterId === selectedMonsterId || monster.workshopMonsterId === editedMonsterId
        ) || null;
    }

    const handleEditMonsterClick = (monsterId: number | null) => {
        setEditedMonsterId(monsterId);
    }

    const handleCreateMonster = async (data: CreateMonsterDTO): Promise<void> => {
        const [err, res] = await workshopMonsterApi.createMonster(data);

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

        successNotification(t("monsters.createSuccess"));

        uponCreated(res.workshopMonsterId);
    }

    const handleEditMonster = async (data: Monster, prevData: Monster): Promise<void> => {

        const isImageUpdated = data.image !== prevData.image;

        const updateData: UpdateWorkshopMonsterDTO = {
            ...data,
            workshopMonsterId: prevData.workshopMonsterId || 0,
            isImageUpdated: isImageUpdated,
        }

        const [err, res] = await workshopMonsterApi.editMonster(updateData);

        if (err) {
            if (err.status === 400 || err.status === 422) {
                const error = err.response.data.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                if (!error) return;
                errorModal(undefined, `${error.field} is ${error.message}`);
                return;
            }

            serverErrorModal();
            return;
        }

        successNotification(t("monsters.editSuccess"));

        uponEdited(res.workshopMonsterId);
    }

    const uponCreated = async (workshopMonsterId: number) => {

        const [err, res] = await workshopMonsterApi.getOneMonster(workshopMonsterId);

        if (err) {
            serverErrorModal();
            return;
        }

        if (sortValue === SortEnum.RECENT) {
            setWorkshopMonsters((prev) => [res, ...prev]);
            return;
        }

        setWorkshopMonsters((prev) => [...prev, res]);
    }

    const uponEdited = async (workshopMonsterId: number) => {

        const [err, res] = await workshopMonsterApi.getOneMonster(workshopMonsterId);

        if (err) {
            serverErrorModal();
            return;
        }

        setWorkshopMonsters((prev) => prev.map((monster) => monster.workshopMonsterId === res.workshopMonsterId ? res : monster));
    }

    const uponDelete = async (workshopMonsterId: number) => {
        setWorkshopMonsters((prev) => prev.filter((monster) => monster.workshopMonsterId !== workshopMonsterId));
    }

    const resetFilters = () => {
        setSizeFilterValue([]);
        setTypeFilterValue([]);
        setAlignmentFilterValue([]);
    }

    return {
        monsters: filteredWorkshopMonsters,
        loading,
        search,
        sortValue,
        createModalOpen,
        sizeSelection,
        typeSelection,
        alignmentSelection,
        sizeFilterValue,
        typeFilterValue,
        alignmentFilterValue,
        monsterWidth,
        selectedMonsterId,
        editedMonsterId,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleSizeFilter,
        handleTypeFilter,
        handleAlignmentFilter,
        resetFilters,
        uponDelete,
        handleSelectMonster,
        handleCreateMonster,
        handleEditMonsterClick,
        handleEditMonster,
        handleGetMonsterDetails,
    }
}
