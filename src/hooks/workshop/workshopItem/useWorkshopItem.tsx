import { useEffect, useState } from "react";

// api
import { workshopItemApi } from "@/api";

// utils
import { SortEnum } from "@/utils/enums";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";

// interfaces
import type { WorkshopItemReturn } from "@/models/itemInterfaces";

export default function useWorkshopItem() {

    const { serverErrorModal } = useStaticModal();

    const [loading, setLoading] = useState<boolean>(true);

    const [workshopItems, setWorkshopItems] = useState<WorkshopItemReturn[]>([]);
    const [filteredWorkshopItems, setFilteredWorkshopItems] = useState<WorkshopItemReturn[]>([]);

    const [search, setSearch] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortValue, setSortValue] = useState<string>(SortEnum.RECENT);

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);

    useEffect(() => {
        getWorkshopItemData();
    }, []);

    useEffect(() => {
        setFilteredWorkshopItems(workshopItems);
    }, [workshopItems]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchValue(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (!searchValue) return setFilteredWorkshopItems(workshopItems);

        let filtered = [...workshopItems];

        if (searchValue) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        setFilteredWorkshopItems(filtered);
    }, [searchValue]);

    useEffect(() => {
        if (sortValue === SortEnum.RECENT) {
            setFilteredWorkshopItems((prev) => [...prev].sort((a, b) => b.createdAt.toString().localeCompare(a.createdAt.toString())));
        }

        if (sortValue === SortEnum.ASC) {
            setFilteredWorkshopItems((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
        }

        if (sortValue === SortEnum.DESC) {
            setFilteredWorkshopItems((prev) => [...prev].sort((a, b) => b.name.localeCompare(a.name)));
        }
    }, [sortValue, searchValue]);

    const getWorkshopItemData = async () => {
        setLoading(true);

        try {
            const [error, res] = await workshopItemApi.getItems();

            if (error) {
                serverErrorModal();
                return;
            }

            setWorkshopItems(res);

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

    const handleFilterModal = (value: boolean) => {
        setFilterModalOpen(value);
    }

    const uponCreated = (data: WorkshopItemReturn) => {
        if (sortValue === SortEnum.RECENT) {
            setWorkshopItems((prev) => [data, ...prev]);
            return;
        }

        setWorkshopItems((prev) => [...prev, data]);
    }

    return {
        items: filteredWorkshopItems,
        loading,
        search,
        sortValue,
        createModalOpen,
        filterModalOpen,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleFilterModal,
        uponCreated,
    }
}
