import { Empty, Typography } from "antd";

// components
import WorkshopControl from "@/components/workshop/WorkshopControl";
import WorkshopItemCard from "./WorkshopItemCard";
import CardSkeleton from "../CardSkeleton";
import CreateItemModal from "./CreateItemModal";

// hooks
import useWorkshopItem from "@/hooks/workshop/workshopItem/useWorkshopItem";

const { Text } = Typography;


export default function WorkshopItem() {

    const {
        items,
        loading,
        search,
        sortValue,
        createModalOpen,
        filterModalOpen,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleFilterModal,
    } = useWorkshopItem();

    return (
        <div style={styles.container}>
            <WorkshopControl
                search={search}
                onSearch={handleSearch}
                sort={sortValue}
                onSort={handleSort}
                onCreate={() => handleCreateModal(true)}
                onFilterClick={() => handleFilterModal(true)}
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
    }
}
