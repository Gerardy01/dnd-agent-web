
import { Empty, Typography } from "antd";

// components
import WorkshopControl from "@/components/workshop/WorkshopControl";
import WorkshopFactionCard from "@/components/workshop/workshopFaction/WorkshopFactionCard";
import CardSkeleton from "@/components/workshop/CardSkeleton";
import CreateFactionModal from "@/components/faction/CreateFactionModal";
import FactionDisplayModal from "@/components/faction/FactionDisplayModal";
import EditFactionModal from "@/components/faction/EditFactionModal";

// hooks
import useWorkshopFaction from "@/hooks/workshop/workshopFaction/useWorkshopFaction";

const { Text } = Typography;

export default function WorkshopFaction() {

    const {
        factions,
        loading,
        search,
        sortValue,
        itemWidth,
        createModalOpen,
        selectedFactionId,
        editedFactionId,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleCreateFaction,
        handleSelectFaction,
        handleGetFactionDetails,
        handleEditFactionClick,
        handleEditFaction,
        uponDelete,
    } = useWorkshopFaction();

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
                    Array.from({ length: 8 }).map((_, index) => (
                        <div key={`skeleton-${index}`} style={{ width: itemWidth }}>
                            <CardSkeleton />
                        </div>
                    ))
                ) : factions.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <Empty description="No Factions found" />
                    </div>
                ) : (
                    factions.map((faction) => (
                        <div key={faction.workshopFactionId} style={{ width: itemWidth }}>
                            <WorkshopFactionCard
                                faction={faction}
                                uponDelete={uponDelete}
                                onClick={() => handleSelectFaction(faction.workshopFactionId)}
                                onEditClick={() => handleEditFactionClick(faction.workshopFactionId)}
                            />
                        </div>
                    ))
                )}
            </div>

            {factions.length > 0 && (
                <div style={styles.endContainer}>
                    <Text style={{ fontSize: '1rem' }} strong>You reached the end</Text>
                </div>
            )}

            <CreateFactionModal
                open={createModalOpen}
                onClose={() => handleCreateModal(false)}
                onSubmit={handleCreateFaction}
            />

            {selectedFactionId && (
                <FactionDisplayModal
                    open={!!selectedFactionId}
                    onClose={() => handleSelectFaction(null)}
                    onEdit={() => {
                        handleEditFactionClick(selectedFactionId!);
                        handleSelectFaction(null);
                    }}
                    getFaction={handleGetFactionDetails}
                />
            )}

            {editedFactionId && (
                <EditFactionModal
                    open={!!editedFactionId}
                    onClose={() => handleEditFactionClick(null)}
                    onSubmit={handleEditFaction}
                    getData={handleGetFactionDetails}
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