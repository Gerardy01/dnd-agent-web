import { Empty, Typography } from "antd";

// components
import WorkshopControl from "@/components/workshop/WorkshopControl";
import WorkshopFeatCard from "@/components/workshop/workshopFeat/WorkshopFeatCard";
import CardSkeleton from "@/components/workshop/CardSkeleton";
import CreateFeatModal from "@/components/feat/CreateFeatModal";
import FeatDisplayModal from "@/components/feat/FeatDisplayModal";
import EditFeatModal from "@/components/feat/EditFeatModal";

// hooks
import useWorkshopFeat from "@/hooks/workshop/workshopFeat/useWorkshopFeat";

const { Text } = Typography;

export default function WorkshopFeat() {

    const {
        feats,
        loading,
        search,
        sortValue,
        itemWidth,
        createModalOpen,
        selectedFeatId,
        editedFeatId,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleCreateFeat,
        handleSelectFeat,
        handleGetFeatDetails,
        handleEditFeatClick,
        handleEditFeat,
        uponDelete,
    } = useWorkshopFeat();

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
                ) : feats.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <Empty description="No Feats found" />
                    </div>
                ) : (
                    feats.map((feat) => (
                        <div key={feat.workshopFeatId} style={{ width: itemWidth }}>
                            <WorkshopFeatCard
                                feat={feat}
                                uponDelete={uponDelete}
                                onClick={() => handleSelectFeat(feat.workshopFeatId)}
                                onEditClick={() => handleEditFeatClick(feat.workshopFeatId)}
                            />
                        </div>
                    ))
                )}
            </div>

            {feats.length > 0 && (
                <div style={styles.endContainer}>
                    <Text style={{ fontSize: '1rem' }} strong>You reached the end</Text>
                </div>
            )}

            <CreateFeatModal
                open={createModalOpen}
                onClose={() => handleCreateModal(false)}
                onSubmit={handleCreateFeat}
            />

            {selectedFeatId && (
                <FeatDisplayModal
                    open={!!selectedFeatId}
                    onClose={() => handleSelectFeat(null)}
                    onEdit={() => {
                        handleEditFeatClick(selectedFeatId!);
                        handleSelectFeat(null);
                    }}
                    getFeat={handleGetFeatDetails}
                />
            )}

            {editedFeatId && (
                <EditFeatModal
                    open={!!editedFeatId}
                    onClose={() => handleEditFeatClick(null)}
                    onSubmit={handleEditFeat}
                    getData={handleGetFeatDetails}
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