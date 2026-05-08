import { Empty, Typography } from "antd";

// components
import WorkshopControl from "@/components/workshop/WorkshopControl";
import WorkshopClassCard from "@/components/workshop/workshopClass/WorkshopClassCard";
import CardSkeleton from "@/components/workshop/CardSkeleton";
import CreateClassModal from "@/components/class/CreateClassModal";
import EditClassModal from "@/components/class/EditClassModal";

// hooks
import useWorkshopClass from "@/hooks/workshop/workshopClass/useWorkshopClass";
import WorkshopClassDisplayModal from "./WorkshopClassDisplayModal";

const { Text } = Typography;


export default function WorkshopClass() {

    const {
        classes,
        loading,
        search,
        sortValue,
        createModalOpen,
        cardWidth,
        editedClassId,
        selectedClassId,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleCreateClass,
        handleSelectClass,
        handleEditClassClick,
        handleEditClass,
        handleGetClassDetails,
        uponDelete,
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
                                uponDelete={uponDelete}
                                onClick={() => handleSelectClass(cls.workshopClassId)}
                                onEditClick={() => handleEditClassClick(cls.workshopClassId)}
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

            {editedClassId && (
                <EditClassModal
                    open={!!editedClassId}
                    onClose={() => handleEditClassClick(null)}
                    onSubmit={handleEditClass}
                    getData={handleGetClassDetails}
                    workshopSpells={spells}
                />
            )}

            {selectedClassId && (
                <WorkshopClassDisplayModal
                    open={!!selectedClassId}
                    workshopClassId={selectedClassId}
                    onClose={() => handleSelectClass(null)}
                    onEdit={() => {
                        handleEditClassClick(selectedClassId);
                        handleSelectClass(null);
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
}
