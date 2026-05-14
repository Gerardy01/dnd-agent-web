import { Empty, Typography } from "antd";

// components
import WorkshopControl from "@/components/workshop/WorkshopControl";
import WorkshopRaceCard from "@/components/workshop/workshopRace/WorkshopRaceCard";
import CardSkeleton from "@/components/workshop/CardSkeleton";
import CreateRaceModal from "@/components/race/CreateRaceModal";
import WorkshopRaceDisplayModal from "@/components/workshop/workshopRace/WorkshopRaceDisplayModal";
import EditRaceModal from "@/components/race/EditRaceModal";

// hooks
import useWorkshopRace from "@/hooks/workshop/workshopRace/useWorkshopRace";

const { Text } = Typography;

export default function WorkshopRace() {

    const {
        races,
        loading,
        search,
        sortValue,
        createModalOpen,
        cardWidth,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleCreateRace,
        handleSelectRace,
        handleEditRaceClick,
        uponDelete,
        handleGetRaceDetails,
        handleEditRace,
        selectedRaceId,
        editedRaceId,
        spells,
    } = useWorkshopRace();

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
                ) : races.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <Empty description="No Races found" />
                    </div>
                ) : (
                    races.map((race) => (
                        <div key={race.workshopRaceId} style={{ width: cardWidth }}>
                            <WorkshopRaceCard
                                item={race}
                                uponDelete={uponDelete}
                                onClick={() => handleSelectRace(race.workshopRaceId)}
                                onEditClick={() => handleEditRaceClick(race.workshopRaceId)}
                            />
                        </div>
                    ))
                )}
            </div>

            {races.length > 0 && (
                <div style={styles.endContainer}>
                    <Text style={{ fontSize: '1rem' }} strong>You reached the end</Text>
                </div>
            )}

            <CreateRaceModal
                open={createModalOpen}
                onClose={() => handleCreateModal(false)}
                onSubmit={handleCreateRace}
                workshopSpells={spells}
            />

            {/* Modals */}
            {selectedRaceId !== null && (
                <WorkshopRaceDisplayModal
                    open={selectedRaceId !== null}
                    onClose={() => handleSelectRace(null)}
                    workshopRaceId={selectedRaceId}
                    onEdit={() => {
                        handleEditRaceClick(selectedRaceId);
                        handleSelectRace(null);
                    }}
                />
            )}

            {editedRaceId !== null && (
                <EditRaceModal
                    open={editedRaceId !== null}
                    onClose={() => handleEditRaceClick(null)}
                    onSubmit={handleEditRace}
                    getData={handleGetRaceDetails}
                    workshopSpells={spells}
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
