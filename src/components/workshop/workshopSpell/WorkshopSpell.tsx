import { Button, Empty, InputNumber, Radio, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

// components
import WorkshopControl from "@/components/workshop/WorkshopControl";
import WorkshopSpellCard from "@/components/workshop/workshopSpell/WorkshopSpellCard";
import CardSkeleton from "@/components/workshop/CardSkeleton";
import CreateSpellModal from "@/components/spell/CreateSpellModal";
import EditSpellModal from "@/components/spell/EditSpellModal";
import SpellDisplayModal from "@/components/spell/SpellDisplayModal";

// hooks
import useWorkshopSpell from "@/hooks/workshop/workshopSpell/useWorkshopSpell";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

export default function WorkshopSpell() {

    const {
        spells,
        loading,
        search,
        sortValue,
        attackFilter,
        minLevel,
        maxLevel,
        spellWidth,
        createModalOpen,
        handleSearch,
        handleSort,
        handleAttackFilter,
        handleMinLevel,
        handleMaxLevel,
        handleCreateModal,
        resetFilters,
        uponDelete,
        handleCreateSpell,
        selectedSpellId,
        editedSpellId,
        handleSelectSpell,
        handleGetSpellDetails,
        handleEditSpellClick,
        handleEditSpell,
    } = useWorkshopSpell();

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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <Title level={5} style={{ fontSize: '14px', marginBottom: '8px' }}>
                                    {t('spells.attackType')}
                                </Title>
                                <Radio.Group
                                    value={attackFilter}
                                    onChange={(e) => handleAttackFilter(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <Radio value="all" style={{ textAlign: 'center', display: 'flex' }}>
                                        {t('global.any')}
                                    </Radio>
                                    <Radio value="attack" style={{ textAlign: 'center', display: 'flex' }}>
                                        {t('spells.onlyAttSpell')}
                                    </Radio>
                                    <Radio value="non-attack" style={{ textAlign: 'center', display: 'flex' }}>
                                        {t('spells.onlyNonAttSpell')}
                                    </Radio>
                                </Radio.Group>
                            </div>

                            <div>
                                <Title level={5} style={{ fontSize: '14px', marginBottom: '8px' }}>
                                    {t('spells.level')}
                                </Title>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <InputNumber
                                        min={0}
                                        max={8}
                                        value={minLevel}
                                        onChange={(val) => handleMinLevel(val || 0)}
                                        style={{ width: '100%' }}
                                        placeholder={t('global.min')}
                                        mode="spinner"
                                    />
                                    <InputNumber
                                        min={1}
                                        max={9}
                                        value={maxLevel}
                                        onChange={(val) => handleMaxLevel(val || 9)}
                                        style={{ width: '100%' }}
                                        placeholder={t('global.max')}
                                        mode="spinner"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            />

            <div style={styles.listContainer}>
                {loading ? (
                    Array.from({ length: 12 }).map((_, index) => (
                        <div key={`skeleton-${index}`} style={{ width: spellWidth }}>
                            <CardSkeleton />
                        </div>
                    ))
                ) : spells.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <Empty description="No Spells found" />
                    </div>
                ) : (
                    spells.map((spell) => (
                        <div key={spell.workshopSpellId} style={{ width: spellWidth }}>
                            <WorkshopSpellCard
                                spell={spell}
                                uponDelete={uponDelete}
                                onClick={() => handleSelectSpell(spell.workshopSpellId)}
                                onEditClick={() => handleEditSpellClick(spell.workshopSpellId)}
                            />
                        </div>
                    ))
                )}
            </div>

            {spells.length > 0 && (
                <div style={styles.endContainer}>
                    <Text style={{ fontSize: '1rem' }} strong>You reached the end</Text>
                </div>
            )}

            <CreateSpellModal
                open={createModalOpen}
                onClose={() => handleCreateModal(false)}
                onSubmit={handleCreateSpell}
            />

            {editedSpellId && (
                <EditSpellModal
                    open={!!editedSpellId}
                    onClose={() => handleEditSpellClick(null)}
                    onSubmit={handleEditSpell}
                    getData={handleGetSpellDetails}
                />
            )}
            {selectedSpellId && (
                <SpellDisplayModal
                    open={!!selectedSpellId}
                    onClose={() => handleSelectSpell(null)}
                    getSpell={handleGetSpellDetails}
                    onEdit={() => {
                        handleSelectSpell(null);
                        handleEditSpellClick(selectedSpellId);
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
