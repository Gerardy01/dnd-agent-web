import { useEffect, useState } from "react";

// api
import { workshopItemApi } from "@/api";

// utils
import { SortEnum } from "@/utils/enums";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";
import { useTranslation } from "react-i18next";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// interfaces
import type { WorkshopItemReturn } from "@/models/itemInterfaces";

export default function useWorkshopItem() {

    const { t } = useTranslation();
    const { serverErrorModal } = useStaticModal();

    const { itemOptions } = useReferenceStore();

    const [loading, setLoading] = useState<boolean>(true);

    const [workshopItems, setWorkshopItems] = useState<WorkshopItemReturn[]>([]);
    const [filteredWorkshopItems, setFilteredWorkshopItems] = useState<WorkshopItemReturn[]>([]);

    const [search, setSearch] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortValue, setSortValue] = useState<string>(SortEnum.RECENT);
    const [typeFilterValue, setTypeFilterValue] = useState<string[]>([]);
    const [categoryFilterValue, setCategoryFilterValue] = useState<string[]>([]);
    const [rarityFilterValue, setRarityFilterValue] = useState<string[]>([]);
    const [magicItemOnly, setMagicItemOnly] = useState<boolean>(false);

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

    const typeSelection = itemOptions.itemType.map((itemType) => ({
        label: t(`items.${itemType}`),
        value: itemType,
    }));

    const categorySelection = [
        ...itemOptions.weaponCategories.map((weaponCategory) => ({
            label: t(`items.${weaponCategory}`),
            value: weaponCategory,
        })),
        ...itemOptions.armorCategories.map((armorCategory) => ({
            label: t(`items.${armorCategory}`),
            value: armorCategory,
        })),
        ...itemOptions.gearCategories.map((gearCategory) => ({
            label: t(`items.${gearCategory}`),
            value: gearCategory,
        })),
    ];

    const raritySelection = itemOptions.itemRarity.map((rarity) => ({
        label: t(`items.${rarity}`),
        value: rarity,
    }));

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
        if (
            !searchValue &&
            typeFilterValue.length === 0 &&
            categoryFilterValue.length === 0 &&
            rarityFilterValue.length === 0 &&
            !magicItemOnly
        ) return setFilteredWorkshopItems(workshopItems);

        let filtered = [...workshopItems];

        if (searchValue) {
            filtered = filtered.filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        if (typeFilterValue.length > 0) {
            filtered = filtered.filter((item) =>
                typeFilterValue.includes(item.type)
            );
        }

        if (categoryFilterValue.length > 0) {
            filtered = filtered.filter((item) =>
                categoryFilterValue.includes(item.category)
            );
        }

        if (rarityFilterValue.length > 0) {
            filtered = filtered.filter((item) =>
                rarityFilterValue.includes(item.rarity)
            );
        }

        if (magicItemOnly) {
            filtered = filtered.filter((item) => item.isMagicItem);
        }

        setFilteredWorkshopItems(filtered);
    }, [searchValue, typeFilterValue, categoryFilterValue, rarityFilterValue, magicItemOnly]);

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

    const handleTypeFilter = (value: string[]) => {
        setTypeFilterValue(value);
    }

    const handleCategoryFilter = (value: string[]) => {
        setCategoryFilterValue(value);
    }

    const handleRarityFilter = (value: string[]) => {
        setRarityFilterValue(value);
    }

    const handleMagicItemOnly = (value: boolean) => {
        setMagicItemOnly(value);
    }

    const uponCreated = (data: WorkshopItemReturn) => {
        if (sortValue === SortEnum.RECENT) {
            setWorkshopItems((prev) => [data, ...prev]);
            return;
        }

        setWorkshopItems((prev) => [...prev, data]);
    }

    const resetFilters = () => {
        setTypeFilterValue([]);
        setCategoryFilterValue([]);
        setRarityFilterValue([]);
        setMagicItemOnly(false);
    }

    return {
        items: filteredWorkshopItems,
        loading,
        search,
        sortValue,
        createModalOpen,
        typeSelection,
        categorySelection,
        raritySelection,
        typeFilterValue,
        categoryFilterValue,
        rarityFilterValue,
        magicItemOnly,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleTypeFilter,
        handleCategoryFilter,
        handleRarityFilter,
        handleMagicItemOnly,
        resetFilters,
        uponCreated,
    }
}
