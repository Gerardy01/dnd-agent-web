import { Button, Empty, Select, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

// components
import WorkshopControl from "@/components/workshop/WorkshopControl";
import WorkshopMonsterCard from "@/components/workshop/workshopMonster/WorkshopMonsterCard";
import CardSkeleton from "@/components/workshop/CardSkeleton";
import CreateMonsterModal from "@/components/monster/CreateMonsterModal";
import EditMonsterModal from "@/components/monster/EditMonsterModal";
import MonsterDisplayModal from "@/components/monster/MonsterDisplayModal";

// hooks
import useWorkshopMonster from "@/hooks/workshop/workshopMonster/useWorkshopMonster";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

export default function WorkshopMonster() {

    const {
        monsters,
        loading,
        search,
        sortValue,
        createModalOpen,
        sizeSelection,
        typeSelection,
        alignmentSelection,
        sizeFilterValue,
        typeFilterValue,
        alignmentFilterValue,
        monsterWidth,
        selectedMonsterId,
        editedMonsterId,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleSizeFilter,
        handleTypeFilter,
        handleAlignmentFilter,
        resetFilters,
        uponDelete,
        handleSelectMonster,
        handleCreateMonster,
        handleEditMonsterClick,
        handleEditMonster,
        handleGetMonsterDetails,
    } = useWorkshopMonster();

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
                            <Title level={5} style={{ margin: '0px' }}>{t('monsters.filterMonsters')}</Title>
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
                                placeholder={t('monsters.sizePlaceholder')}
                                mode="multiple"
                                options={sizeSelection}
                                value={sizeFilterValue}
                                onChange={value => handleSizeFilter(value)}
                            />
                            <Select
                                style={{ width: '100%' }}
                                size="large"
                                placeholder={t('monsters.typePlaceholder')}
                                mode="multiple"
                                options={typeSelection}
                                value={typeFilterValue}
                                onChange={value => handleTypeFilter(value)}
                            />
                            <Select
                                style={{ width: '100%' }}
                                size="large"
                                placeholder={t('monsters.alignmentPlaceholder')}
                                mode="multiple"
                                options={alignmentSelection}
                                value={alignmentFilterValue}
                                onChange={value => handleAlignmentFilter(value)}
                            />
                        </div>
                    </div>
                }
            />

            <div style={styles.listContainer}>
                {loading ? (
                    Array.from({ length: 12 }).map((_, index) => (
                        <div key={`skeleton-${index}`} style={{ width: monsterWidth }}>
                            <CardSkeleton />
                        </div>
                    ))
                ) : monsters.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <Empty description="No Monsters found" />
                    </div>
                ) : (
                    monsters.map((monster) => (
                        <div key={monster.workshopMonsterId} style={{ width: monsterWidth }}>
                            <WorkshopMonsterCard
                                monster={monster}
                                uponDelete={uponDelete}
                                onClick={() => handleSelectMonster(monster.workshopMonsterId)}
                                onEditClick={() => handleEditMonsterClick(monster.workshopMonsterId)}
                            />
                        </div>
                    ))
                )}
            </div>

            {monsters.length > 0 && (
                <div style={styles.endContainer}>
                    <Text style={{ fontSize: '1rem' }} strong>You reached the end</Text>
                </div>
            )}

            <CreateMonsterModal
                open={createModalOpen}
                onClose={() => handleCreateModal(false)}
                onSubmit={handleCreateMonster}
            />

            {editedMonsterId && (
                <EditMonsterModal
                    open={editedMonsterId !== null}
                    onClose={() => handleEditMonsterClick(null)}
                    onSubmit={handleEditMonster}
                    getData={handleGetMonsterDetails}
                />
            )}

            {selectedMonsterId && (
                <MonsterDisplayModal
                    open={selectedMonsterId !== null}
                    onClose={() => handleSelectMonster(null)}
                    onEdit={() => {
                        handleEditMonsterClick(selectedMonsterId);
                        handleSelectMonster(null);
                    }}
                    getMonster={handleGetMonsterDetails}
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