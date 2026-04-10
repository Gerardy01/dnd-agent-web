import { Button, Empty, Select, Switch, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

// components
import WorkshopControl from "@/components/workshop/WorkshopControl";
import WorkshopItemCard from "@/components/workshop/workshopItem/WorkshopItemCard";
import CardSkeleton from "@/components/workshop/CardSkeleton";
import CreateItemModal from "@/components/item/CreateItemModal";
import EditItemModal from "@/components/item/EditItemModal";
import ItemDisplayModal from "@/components/item/ItemDisplayModal";

// hooks
import useWorkshopItem from "@/hooks/workshop/workshopItem/useWorkshopItem";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;


export default function WorkshopItem() {

    const {
        items,
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
    } = useWorkshopItem();

    const { t } = useTranslation();

    return (
        <div style={styles.container}>
            <WorkshopControl
                search={search}
                onSearch={handleSearch}
                sort={sortValue}
                onSort={handleSort}
                onCreate={() => handleCreateModal(true)}
                filterModalContent={
                    <div style={styles.filterContainer}>
                        <div style={styles.filterHeader}>
                            <Title level={5} style={{ margin: '0px' }}>{t('items.filterItems')}</Title>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={resetFilters}
                            >
                                {t('global.reset')}
                            </Button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Select
                                style={{ width: '100%' }}
                                size="large"
                                placeholder={t('items.itemTypePlaceholder')}
                                mode="multiple"
                                options={typeSelection}
                                value={typeFilterValue}
                                onChange={value => handleTypeFilter(value)}
                            />
                            <Select
                                style={{ width: '100%' }}
                                size="large"
                                placeholder={t('items.categoryPlaceholder')}
                                mode="multiple"
                                options={categorySelection}
                                value={categoryFilterValue}
                                onChange={value => handleCategoryFilter(value)}
                            />
                            <Select
                                style={{ width: '100%' }}
                                size="large"
                                placeholder={t('items.rarityPlaceholder')}
                                mode="multiple"
                                options={raritySelection}
                                value={rarityFilterValue}
                                onChange={value => handleRarityFilter(value)}
                            />
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Switch
                                    checked={magicItemOnly}
                                    onChange={value => handleMagicItemOnly(value)}
                                />
                                <Text style={{ marginLeft: '0.7rem' }}>{t('items.magicItemOnly')}</Text>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Switch
                                    checked={equipableOnly}
                                    onChange={value => handleEquipableOnly(value)}
                                />
                                <Text style={{ marginLeft: '0.7rem' }}>{t('items.equipableOnly')}</Text>
                            </div>
                        </div>
                    </div>
                }
            />

            <div style={styles.listContainer}>
                {loading ? (
                    Array.from({ length: 12 }).map((_, index) => (
                        <div key={`skeleton-${index}`} style={{ width: itemWidth }}>
                            <CardSkeleton />
                        </div>
                    ))
                ) : items.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <Empty description="No Items found" />
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.workshopItemId} style={{ width: itemWidth }}>
                            <WorkshopItemCard
                                item={item}
                                uponDelete={uponDelete}
                                onClick={() => handleSelectItem(item.workshopItemId)}
                                onEditClick={() => handleEditItemClick(item.workshopItemId)}
                            />
                        </div>
                    ))
                )}
            </div>

            {items.length > 0 && (
                <div style={styles.endContainer}>
                    <Text style={{ fontSize: '1rem' }} strong>You reached the end</Text>
                </div>
            )}

            <CreateItemModal
                open={createModalOpen}
                onClose={() => handleCreateModal(false)}
                onSubmit={handleCreateItem}
            />

            {editedItemId && (
                <EditItemModal
                    open={!!editedItemId}
                    onClose={() => handleEditItemClick(null)}
                    onSubmit={handleEditItem}
                    getData={handleGetItemDetails}
                />
            )}

            {selectedItemId && (
                <ItemDisplayModal
                    open={!!selectedItemId}
                    onClose={() => handleSelectItem(null)}
                    getItem={handleGetItemDetails}
                    onEdit={() => {
                        handleEditItemClick(selectedItemId!);
                        handleSelectItem(null);
                    }}
                />
            )}

        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        marginTop: '1rem',
    },
    listContainer: {
        marginTop: '1rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    emptyContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '3rem 0',
    },
    endContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '3rem',
        paddingBottom: '1rem',
    },
    filterContainer: {
        width: '25rem',
        padding: '0.7rem',
    },
    filterHeader: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
    }
}