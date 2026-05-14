import { Modal, Typography, Button, Dropdown, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { EditOutlined, InfoCircleOutlined, CodeSandboxOutlined, PlusOutlined, EllipsisOutlined, DeleteOutlined, GlobalOutlined } from "@ant-design/icons";

// hooks
import useWorkshopRaceDisplayModal from "@/hooks/workshop/workshopRace/useWorkshopRaceDisplayModal";

// components
import DisplayModalSkeletonV2 from "@/components/global/common/DisplayModalSkeletonV2";
import DisplaySectionHeader from "@/components/global/common/DisplaySectionHeader";
import TraitForm from "@/components/race/TraitForm";

// assets
import { noItemImage, SparklesIcon } from "@/assets";
import { ClassDisplayTabEnum } from "@/utils/enums";

interface Props {
    workshopRaceId: number;
    open: boolean;
    onClose: () => void;
    onEdit: () => void;
}

const { Text, Title } = Typography;

const EmptyListDisplay = ({ message }: { message: string }) => (
    <div style={styles.emptyContainer}>
        <InfoCircleOutlined style={{ fontSize: '2rem', color: '#d3c9b3', marginBottom: '1rem' }} />
        <Text style={{ color: '#8c8069', fontSize: '1.1rem', fontFamily: 'Georgia, serif' }}>{message}</Text>
    </div>
);

export default function WorkshopRaceDisplayModal({ workshopRaceId, open, onClose, onEdit }: Props) {

    const {
        workshopRace,
        activeTab,
        tabs,
        handleTabChange,
        editingTraitIndex,
        traitToEdit,
        featureTypeSelection,
        isSubmittingTrait,
        hasProgression,
        handleStartAddTrait,
        handleStartEditTrait,
        handleCancelTrait,
        handleAddTrait,
        handleEditTrait,
        handleDeleteTrait,
    } = useWorkshopRaceDisplayModal({ workshopRaceId, open });

    const { t } = useTranslation();

    return (
        <Modal
            open={open}
            footer={null}
            destroyOnHidden
            onCancel={onClose}
            width={'70rem'}
            centered
            style={styles.modal}
            maskClosable={false}
            closeIcon={
                <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <span style={{ fontSize: '14px', lineHeight: 1 }}>✕</span>
                </div>
            }
            styles={{
                container: {
                    padding: '0px',
                    backgroundColor: '#f5f2ea',
                    overflow: 'auto',
                },
                body: {
                    overflow: 'auto',
                    minHeight: '45rem',
                    maxHeight: 'calc(100vh - 8rem)',
                    padding: 0,
                },
            }}
        >
            {workshopRace ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Header Image with Fading Effect */}
                    <div style={styles.imageHeaderContainer}>
                        <div
                            style={{
                                ...styles.headerImage,
                                backgroundImage: `url(${workshopRace.image || noItemImage})`
                            }}
                        />
                        <div style={styles.imageGradientOverlay} />
                        <div style={styles.headerTitleContainer}>
                            <Title level={1} style={styles.headerTitle}>{workshopRace.name}</Title>
                            <Text style={styles.headerSubtitle}>
                                {workshopRace.spellcastingProperties ? "Spellcaster | " : ""} {workshopRace.speed} ft Speed
                            </Text>
                        </div>
                    </div>

                    {/* Selection (Tabs) */}
                    <div style={styles.tabsContainer}>
                        {tabs.map(tab => (
                            <div
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                style={{
                                    ...styles.tabItem,
                                    borderBottomColor: activeTab === tab.key ? "#d35400" : "transparent"
                                }}
                            >
                                <Text style={{
                                    ...styles.tabText,
                                    ...(activeTab === tab.key ? styles.activeTabText : {})
                                }}>
                                    {tab.label.toUpperCase()}
                                </Text>
                            </div>
                        ))}
                    </div>

                    {/* Content Section */}
                    <div style={styles.contentContainer}>
                        {activeTab === ClassDisplayTabEnum.OVERVIEW && (
                            <div style={{ padding: '1rem 0' }}>
                                <DisplaySectionHeader icon={<InfoCircleOutlined />} title={`${t('classes.description')}`.toUpperCase()} />
                                <div style={styles.descriptionText}>
                                    {workshopRace.description.split('\n').map((line, idx) => (
                                        <p key={idx} style={{ margin: line.trim() ? '0 0 1rem 0' : '0' }}>{line}</p>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div style={styles.propertyBox}>
                                        <Text style={styles.propertyLabel}>{"SPEED"}</Text><br />
                                        <Text style={styles.propertyValue}>{workshopRace.speed} ft</Text>
                                    </div>
                                </div>

                                {workshopRace.spellcastingProperties && (
                                    <>
                                        <div style={{ marginTop: '2rem' }}>
                                            <DisplaySectionHeader icon={<SparklesIcon />} title={`${t('classes.spellcastingProperties')}`.toUpperCase()} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                            <div style={{ ...styles.spellSaveBox, border: '1px solid #b6d4fe', backgroundColor: '#f0f8ff' }}>
                                                <Text strong style={styles.spellSaveLabel}>{`${t('classes.spellcastingAbility')}`.toUpperCase()}</Text>
                                                <Text strong style={{ fontSize: '1.1rem', color: '#0d6efd' }}>{String(workshopRace.spellcastingProperties.spellcastingAbility).toUpperCase()}</Text>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div style={{ marginTop: '2rem' }}>
                                    <DisplaySectionHeader icon={<GlobalOutlined />} title={"LANGUAGES"} />
                                    <div style={{ ...styles.descriptionText, marginTop: '1rem' }}>
                                        <Text style={{ fontSize: '1.1rem' }}>{workshopRace.language}</Text>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === ClassDisplayTabEnum.FEATURES && (
                            <div style={{ padding: '1rem 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                    <Title level={3} style={{ letterSpacing: '1.5px', color: '#8c8069', fontFamily: 'Georgia, serif', marginBottom: '0px' }}>
                                        {"TRAITS"}
                                    </Title>
                                    <Button
                                        type="text"
                                        icon={<PlusOutlined />}
                                        style={styles.addButton}
                                        onClick={handleStartAddTrait}
                                        disabled={isSubmittingTrait}
                                    >
                                        Add Trait
                                    </Button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
                                    {editingTraitIndex === -1 && (
                                        <TraitForm
                                            onSave={handleAddTrait}
                                            onCancel={handleCancelTrait}
                                            featureTypeSelection={featureTypeSelection}
                                            isLoading={isSubmittingTrait}
                                            hasProgression={hasProgression}
                                        />
                                    )}
                                    {workshopRace.traits.length === 0 && editingTraitIndex !== -1 && (
                                        <EmptyListDisplay message={t('global.noData')} />
                                    )}
                                    {(() => {
                                        const groupedTraits = workshopRace.traits.reduce((acc, trait) => {
                                            const level = trait.level || 1;
                                            if (!acc[level]) acc[level] = [];
                                            acc[level].push(trait);
                                            return acc;
                                        }, {} as Record<number, typeof workshopRace.traits>);

                                        return Object.keys(groupedTraits).map(Number).sort((a, b) => a - b).map(level => (
                                            <div key={level}>
                                                {hasProgression && (
                                                    <div style={styles.levelHeader}>
                                                        <Text strong style={styles.levelHeaderText}>LEVEL {level}</Text>
                                                        <div style={styles.levelHeaderDivider} />
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: hasProgression ? '1rem' : 0 }}>
                                                    {groupedTraits[level].map((trait, idx) => (
                                                        <div key={idx}>
                                                            {editingTraitIndex === idx && traitToEdit?.name === trait.name ? (
                                                                <TraitForm
                                                                    initialValues={trait}
                                                                    onSave={handleEditTrait}
                                                                    onCancel={handleCancelTrait}
                                                                    featureTypeSelection={featureTypeSelection}
                                                                    isEdit
                                                                    isLoading={isSubmittingTrait}
                                                                    hasProgression={hasProgression}
                                                                />
                                                            ) : (
                                                                <div style={styles.actionCard}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                                <Text style={styles.actionName}>{trait.name}</Text>
                                                                                <Tag color={trait.type === 'active' ? 'blue' : 'default'} style={{ textTransform: 'capitalize', borderRadius: '4px', fontSize: '10px' }}>
                                                                                    {t(`classes.${trait.type}`)}
                                                                                </Tag>
                                                                            </div>
                                                                        </div>
                                                                        <Dropdown
                                                                            menu={{
                                                                                items: [
                                                                                    {
                                                                                        key: 'edit',
                                                                                        label: t('global.edit'),
                                                                                        icon: <EditOutlined />,
                                                                                        onClick: () => handleStartEditTrait(trait, idx)
                                                                                    },
                                                                                    {
                                                                                        key: 'delete',
                                                                                        label: t('global.delete'),
                                                                                        danger: true,
                                                                                        icon: <DeleteOutlined />,
                                                                                        onClick: () => handleDeleteTrait(trait)
                                                                                    }
                                                                                ]
                                                                            }}
                                                                            trigger={['click']}
                                                                        >
                                                                            <Button
                                                                                type="text"
                                                                                icon={<EllipsisOutlined />}
                                                                                style={styles.menuButton}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <Text style={styles.actionDescription}>{trait.description}</Text>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        )}
                        {activeTab === ClassDisplayTabEnum.SPELLS && (
                            <div style={{ padding: '1rem 0' }}>
                                <DisplaySectionHeader icon={<CodeSandboxOutlined />} title={`${t('workshop.spells')}`.toUpperCase()} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    {workshopRace.spells.length === 0 ? (
                                        <EmptyListDisplay message={t('global.noData')} />
                                    ) : (
                                        workshopRace.spells.map((spell, idx) => (
                                            <div key={idx} style={styles.actionCard}>
                                                <Text style={styles.actionName}>{spell.name}</Text>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === ClassDisplayTabEnum.OVERVIEW && (
                            <div style={styles.editButtonContainer}>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={onEdit}
                                    style={styles.editButton}
                                >
                                    {t('global.edit')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <DisplayModalSkeletonV2 />
            )}
        </Modal>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    modal: {
        margin: '2rem 0px',
    },
    imageHeaderContainer: {
        position: 'relative',
        width: '100%',
        height: '320px',
        flexShrink: 0,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundAttachment: 'fixed'
    },
    imageGradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        background: 'linear-gradient(to bottom, transparent, #f5f2ea)',
    },
    headerTitleContainer: {
        position: 'absolute',
        bottom: '1rem',
        left: '2rem',
    },
    headerTitle: {
        margin: 0,
        fontFamily: 'Georgia, serif',
        color: '#4a463d',
        fontWeight: 'bold',
        fontSize: '2.5rem',
        textShadow: '1px 1px 3px rgba(255,255,255,0.7)',
    },
    headerSubtitle: {
        fontSize: '1.1rem',
        textShadow: '1px 1px 3px rgba(255,255,255,0.7)',
    },
    tabsContainer: {
        display: 'flex',
        gap: '2rem',
        padding: '0 2rem',
        borderBottom: '1px solid #d3c9b3',
        flexShrink: 0,
    },
    tabItem: {
        padding: '1rem 0',
        cursor: 'pointer',
        borderBottom: '3px solid transparent',
        transition: 'all 0.3s ease',
    },
    tabText: {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        color: '#8c8069',
        letterSpacing: '1px',
    },
    activeTabText: {
        color: '#d35400',
    },
    contentContainer: {
        minHeight: '22rem',
        padding: '1rem 2rem 2rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FEFDFA',
    },
    descriptionText: {
        marginTop: '1rem',
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#4a463d',
        marginBottom: '1.5rem',
    },
    spellSaveBox: {
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem 1rem',
        minWidth: '13rem',
    },
    spellSaveLabel: {
        fontSize: '0.7rem',
        color: '#8c8069',
        letterSpacing: '1px',
        marginBottom: '0.5rem',
        textAlign: 'center'
    },
    propertyBox: {
        width: 'fit-content',
        minWidth: '200px',
        border: '1px solid #d3c9b3',
        borderRadius: '4px',
        padding: '1rem',
        backgroundColor: '#fcfbf9'
    },
    propertyLabel: {
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#8c8069',
        letterSpacing: '1px'
    },
    propertyValue: {
        fontFamily: 'Georgia, serif',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#4a463d'
    },
    actionCard: {
        borderBottom: '1px solid #e0dcd2ff',
        paddingBottom: '0.8rem',
        backgroundColor: '#f5f2ea',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #d3c9b3',
    },
    actionName: {
        fontWeight: 'bold',
        fontSize: '1.1rem',
        color: '#4a463d',
    },
    levelTag: {
        backgroundColor: '#4a463d',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
    },
    actionDescription: {
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#4a463d',
        display: 'block',
        marginTop: '0.5rem',
    },
    levelHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2rem'
    },
    levelHeaderText: {
        color: '#8c8069',
        letterSpacing: '2px',
        fontSize: '0.9rem'
    },
    levelHeaderDivider: {
        flex: 1,
        height: '1px',
        backgroundColor: '#d3c9b3'
    },
    emptyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        backgroundColor: '#fcfbf9',
        border: '1px dashed #d3c9b3',
        borderRadius: '8px',
        margin: '1rem 0'
    },
    addButton: {
        fontWeight: 'bold',
        color: '#d35400'
    },
    menuButton: {
        opacity: 0.5,
        transition: 'opacity 0.2s ease'
    },
    editButtonContainer: {
        position: 'sticky',
        bottom: 30,
        marginTop: 'auto',
        paddingTop: '1rem',
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 10
    },
    editButton: {
        backgroundColor: '#d35400',
        borderColor: '#d35400',
        color: 'white',
        fontWeight: 'bold',
        padding: '1.2rem 1.8rem',
        borderRadius: '8px',
        opacity: '0.8',
        cursor: 'pointer',
    }
}
