import { Empty, Typography } from "antd";

// components
import WorkshopControl from "@/components/workshop/WorkshopControl";
import WorkshopClassCard from "@/components/workshop/workshopClass/WorkshopClassCard";
import CardSkeleton from "@/components/workshop/CardSkeleton";
import CreateClassModal from "@/components/class/CreateClassModal";

// hooks
import useWorkshopClass from "@/hooks/workshop/workshopClass/useWorkshopClass";

const { Text } = Typography;


export default function WorkshopClass() {

    const {
        classes,
        loading,
        search,
        sortValue,
        createModalOpen,
        cardWidth,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleCreateClass,
        spells,
    } = useWorkshopClass();

    return (
        <div style={styles.container}>
            <WorkshopControl
                search={search}
                onSearch={handleSearch}
                sort={sortValue}
                onSort={handleSort}
                onCreate={() => handleCreateModal(true)}
            />

            <div style={styles.listContainer}>
                {loading ? (
                    Array.from({ length: 12 }).map((_, index) => (
                        <div key={`skeleton-${index}`} style={{ width: cardWidth }}>
                            <CardSkeleton />
                        </div>
                    ))
                ) : classes.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <Empty description="No Classes found" />
                    </div>
                ) : (
                    classes.map((cls) => (
                        <div key={cls.workshopClassId} style={{ width: cardWidth }}>
                            <WorkshopClassCard
                                item={cls}
                                uponDelete={() => { }}
                                onClick={() => { }}
                                onEditClick={() => { }}
                            />
                        </div>
                    ))
                )}
            </div>

            {classes.length > 0 && (
                <div style={styles.endContainer}>
                    <Text style={{ fontSize: '1rem' }} strong>You reached the end</Text>
                </div>
            )}

            <CreateClassModal
                open={createModalOpen}
                onClose={() => handleCreateModal(false)}
                onSubmit={handleCreateClass}
                workshopSpells={spells}
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
}
