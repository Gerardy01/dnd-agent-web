import { Button, Empty, Select, Switch, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

// components
import WorkshopControl from "@/components/workshop/WorkshopControl";
import WorkshopItemCard from "./WorkshopItemCard";
import CardSkeleton from "../CardSkeleton";
import CreateItemModal from "./CreateItemModal";

// hooks
import useWorkshopItem from "@/hooks/workshop/workshopItem/useWorkshopItem";

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
        handleSearch,
        handleSort,
        handleCreateModal,
        handleTypeFilter,
        handleCategoryFilter,
        handleRarityFilter,
        handleMagicItemOnly,
        uponCreated,
        resetFilters,
    } = useWorkshopItem();

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
                            <Title level={5} style={{ margin: '0px' }}>Filter Items</Title>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={resetFilters}
                            >
                                Reset
                            </Button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Select
                                style={{ width: '100%' }}
                                size="large"
                                placeholder="Select item type"
                                mode="multiple"
                                options={typeSelection}
                                value={typeFilterValue}
                                onChange={value => handleTypeFilter(value)}
                            />
                            <Select
                                style={{ width: '100%' }}
                                size="large"
                                placeholder="Select item category"
                                mode="multiple"
                                options={categorySelection}
                                value={categoryFilterValue}
                                onChange={value => handleCategoryFilter(value)}
                            />
                            <Select
                                style={{ width: '100%' }}
                                size="large"
                                placeholder="Select item rarity"
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
                                <Text style={{ marginLeft: '0.7rem' }}>Magic Item Only</Text>
                            </div>
                        </div>
                    </div>
                }
            />

            <div style={styles.listContainer}>
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={`skeleton-${index}`} style={{ width: '24%' }}>
                            <CardSkeleton />
                        </div>
                    ))
                ) : items.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <Empty description="No Items found" />
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.workshopItemId} style={{ width: '24%' }}>
                            <WorkshopItemCard item={item} />
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
                uponWorkshopCreated={uponCreated}
            />

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
