import { useEffect, useState } from "react";

// api
import { workshopItemApi } from "@/api";

// utils
import { SortEnum } from "@/utils/enums";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";
import useNotification from "@/hooks/global/useNotification";
import { useTranslation } from "react-i18next";

// stores
import useReferenceStore from "@/stores/useReferenceStore";

// interfaces
import type { CreateItemDTO, Item, UpdateWorkshopItemDTO, WorkshopItemReturn } from "@/models/itemInterfaces";



export default function useWorkshopItem() {

    const { t } = useTranslation();
    const { serverErrorModal, errorModal } = useStaticModal();
    const { successNotification } = useNotification();

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
    const [equipableOnly, setEquipableOnly] = useState<boolean>(false);

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [editedItemId, setEditedItemId] = useState<number | null>(null);

    const [itemWidth, setItemWidth] = useState<string>(
        window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%'
    );

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
        const handleResize = () => {
            setItemWidth(window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
            !magicItemOnly &&
            !equipableOnly
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

        if (equipableOnly) {
            filtered = filtered.filter((item) => item.equipSlot);
        }

        setFilteredWorkshopItems(filtered);
    }, [searchValue, typeFilterValue, categoryFilterValue, rarityFilterValue, magicItemOnly, equipableOnly]);

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
    }, [sortValue, searchValue, typeFilterValue, categoryFilterValue, rarityFilterValue, magicItemOnly, equipableOnly]);

    const getWorkshopItemData = async () => {
        setLoading(true);

        try {
            const [error, res] = await workshopItemApi.getItems();

            if (error) {
                serverErrorModal();
                return;
            }

            setWorkshopItems(res);
            setFilteredWorkshopItems(res);

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

    const handleEquipableOnly = (value: boolean) => {
        setEquipableOnly(value);
    }

    const handleSelectItem = (itemId: number | null) => {
        setSelectedItemId(itemId);
    }

    const handleGetItemDetails = async (): Promise<Item | null> => {
        return workshopItems.find(
            (item) => item.workshopItemId === selectedItemId || item.workshopItemId === editedItemId
        ) || null;
    }

    const handleEditItemClick = (itemId: number | null) => {
        setEditedItemId(itemId);
    }

    const handleCreateItem = async (data: CreateItemDTO): Promise<void> => {
        const [err, res] = await workshopItemApi.createItem(data);

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

        successNotification(t("items.createSuccess"));

        uponCreated(res.workshopItemId);
    }

    const handleEditItem = async (data: Item): Promise<void> => {

        const prevData = workshopItems.find(item => item.workshopItemId === editedItemId) || null;
        if (!prevData) return;

        const isImageUpdated = data.image !== prevData.image;

        const updateData: UpdateWorkshopItemDTO = {
            ...data,
            workshopItemId: editedItemId || 0,
            isImageUpdated: isImageUpdated,
        }

        const [err, res] = await workshopItemApi.editItem(updateData);

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

        successNotification(t("items.editSuccess"));

        uponEdited(res.workshopItemId);
    }

    const uponCreated = async (workshopItemId: number) => {

        const [err, res] = await workshopItemApi.getOneItem(workshopItemId);

        if (err) {
            serverErrorModal();
            return;
        }

        if (sortValue === SortEnum.RECENT) {
            setWorkshopItems((prev) => [res, ...prev]);
            return;
        }

        setWorkshopItems((prev) => [...prev, res]);
    }

    const uponEdited = async (workshopItemId: number) => {

        const [err, res] = await workshopItemApi.getOneItem(workshopItemId);

        if (err) {
            serverErrorModal();
            return;
        }

        if (sortValue === SortEnum.RECENT) {
            setWorkshopItems((prev) => prev.map((item) => item.workshopItemId === res.workshopItemId ? res : item));
            return;
        }

        setWorkshopItems((prev) => prev.map((item) => item.workshopItemId === res.workshopItemId ? res : item));
    }

    const uponDelete = async (workshopItemId: number) => {
        setWorkshopItems((prev) => prev.filter((item) => item.workshopItemId !== workshopItemId));
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
        equipableOnly,
        itemWidth,
        selectedItemId,
        editedItemId,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleTypeFilter,
        handleCategoryFilter,
        handleRarityFilter,
        handleMagicItemOnly,
        handleEquipableOnly,
        resetFilters,
        uponDelete,
        handleSelectItem,
        handleCreateItem,
        handleEditItemClick,
        handleEditItem,
        handleGetItemDetails,
    }
}
