import { Modal, Typography, Button, Dropdown, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { EditOutlined, InfoCircleOutlined, CodeSandboxOutlined, PlusOutlined, EllipsisOutlined, DeleteOutlined, PictureOutlined } from "@ant-design/icons";

// hooks
import useWorkshopClassDisplayModal from "@/hooks/workshop/workshopClass/useWorkshopClassDisplayModal";

// components
import DisplayModalSkeletonV2 from "@/components/global/common/DisplayModalSkeletonV2";
import DisplaySectionHeader from "@/components/global/common/DisplaySectionHeader";
import FeatureForm from "@/components/class/FeatureForm";
import ClassResourceForm from "@/components/class/ClassResourceForm";
import CreateSubclassForm from "@/components/class/CreateSubclassForm";
import EditSubclassForm from "@/components/class/EditSubclassForm";
import SubclassDisplay from "@/components/class/SubclassDisplay";

// hooks
import useSubclassCard from "@/hooks/workshop/workshopClass/useSubclassCard";

// assets
import { noItemImage, SparklesIcon } from "@/assets";
import { ClassDisplayTabEnum } from "@/utils/enums";

interface Props {
    workshopClassId: number;
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

export default function WorkshopClassDisplayModal({ workshopClassId, open, onClose, onEdit }: Props) {

    const {
        workshopClass,
        activeTab,
        tabs,
        handleTabChange,
        editingFeatureIndex,
        featureToEdit,
        featureTypeSelection,
        isSubmittingFeature,
        handleStartAddFeature,
        handleStartEditFeature,
        handleCancelFeature,
        handleAddFeature,
        handleEditFeature,
        handleDeleteFeature,
        editingResourceIndex,
        resourceToEdit,
        isSubmittingResource,
        handleStartAddResource,
        handleStartEditResource,
        handleCancelResource,
        handleAddResource,
        handleEditResource,
        handleDeleteResource,
        subclasses,
        editingSubclassIndex,
        subclassToEdit,
        isSubmittingSubclass,
        handleStartAddSubclass,
        handleStartEditSubclass,
        handleCancelSubclass,
        handleAddSubclass,
        handleEditSubclass,
        handleDeleteSubclass,
        spells,
        selectedSubclassId,
        selectedSubclassData,
        handleSelectSubclass,
        handleBackFromSubclass,
    } = useWorkshopClassDisplayModal({ workshopClassId, open });

    const { hoveredIndex, handleHover } = useSubclassCard();

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
            {workshopClass ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Header Image with Fading Effect */}
                    <div style={styles.imageHeaderContainer}>
                        <div
                            style={{
                                ...styles.headerImage,
                                backgroundImage: `url(${workshopClass.image || noItemImage})`
                            }}
                        />
                        <div style={styles.imageGradientOverlay} />
                        <div style={styles.headerTitleContainer}>
                            <Title level={1} style={styles.headerTitle}>{workshopClass.name}</Title>
                            <Text style={styles.headerSubtitle}>
                                {workshopClass.spellcastingProperties ? "Spellcaster | " : ""} {workshopClass.hitDie} Hit Die
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
                                {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <div style={styles.imagePreviewContainer}>
                                        {workshopClass.image ? (
                                            <img src={workshopClass.image} alt="Workshop Class" style={styles.imagePreview} />
                                        ) : (
                                            <img src={noItemImage} alt="Workshop Class" style={styles.imagePreview} />
                                        )}
                                    </div>
                                </div> */}
                                <DisplaySectionHeader icon={<InfoCircleOutlined />} title={`${t('classes.description')}`.toUpperCase()} />
                                <div style={styles.descriptionText}>
                                    {workshopClass.description.split('\n').map((line, idx) => (
                                        <p key={idx} style={{ margin: line.trim() ? '0 0 1rem 0' : '0' }}>{line}</p>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div style={styles.propertyBox}>
                                        <Text style={styles.propertyLabel}>{`${t('classes.hitDie')}`.toUpperCase()}</Text><br />
                                        <Text style={styles.propertyValue}>{workshopClass.hitDie}</Text>
                                    </div>
                                    <div style={styles.propertyBox}>
                                        <Text style={styles.propertyLabel}>{`${t('classes.subclassLevel')}`.toUpperCase()}</Text><br />
                                        <Text style={styles.propertyValue}>{workshopClass.subclassLevel}</Text>
                                    </div>
                                </div>

                                {workshopClass.spellcastingProperties && (
                                    <>
                                        <div style={{ marginTop: '2rem' }}>
                                            <DisplaySectionHeader icon={<SparklesIcon />} title={`${t('classes.spellcastingProperties')}`.toUpperCase()} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                            <div style={{ ...styles.spellSaveBox, border: '1px solid #b6d4fe', backgroundColor: '#f0f8ff' }}>
                                                <Text strong style={styles.spellSaveLabel}>{`${t('classes.spellcastingAbility')}`.toUpperCase()}</Text>
                                                <Text strong style={{ fontSize: '1.1rem', color: '#0d6efd' }}>{String(workshopClass.spellcastingProperties.spellcastingAbility).toUpperCase()}</Text>
                                            </div>
                                            <div style={{ ...styles.spellSaveBox, border: '1px solid #d3c9b3', backgroundColor: '#f5f2ea' }}>
                                                <Text strong style={styles.spellSaveLabel}>{`${t('classes.spellcastingType')}`.toUpperCase()}</Text>
                                                <Text strong style={{ fontSize: '1.1rem', color: '#4a463d' }}>{t(`classes.${workshopClass.spellcastingProperties.spellcastingType}`)}</Text>
                                            </div>
                                            <div style={{ ...styles.spellSaveBox, border: '1px solid #d3c9b3', backgroundColor: '#f5f2ea' }}>
                                                <Text strong style={styles.spellSaveLabel}>{`${t('classes.preparationType')}`.toUpperCase()}</Text>
                                                <Text strong style={{ fontSize: '1.1rem', color: '#4a463d' }}>{t(`classes.${workshopClass.spellcastingProperties.preparationType}`)}</Text>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={styles.weaponPropCard}>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                                                    <Text strong style={styles.weaponPropName}>{t('classes.preparedLevelBonus')}</Text>
                                                    <Text style={styles.rangeValue}>
                                                        {workshopClass.spellcastingProperties.preparedLvlBonus === 0 ? t('classes.noLevelBonus') :
                                                            workshopClass.spellcastingProperties.preparedLvlBonus === 0.5 ? t('classes.halfLevelBonus') :
                                                                t('classes.fullLevelBonus')}
                                                    </Text>
                                                </div>
                                                <Text style={styles.weaponPropDesc}>
                                                    Determines if the class gets additional prepared spells based on their level. 100% means they get their full level as a bonus, 50% means they get half their level (rounded down), and 0% means they don't get any level-based bonus.
                                                </Text>
                                            </div>
                                            <div style={styles.weaponPropCard}>
                                                <Text strong style={styles.weaponPropName}>{t('classes.preparedModifierBonus')}</Text>
                                                <Text style={styles.weaponPropDesc}>
                                                    Indicates if the class gets additional prepared spells based on their spellcasting ability modifier
                                                </Text>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        {activeTab === ClassDisplayTabEnum.FEATURES && (
                            <div style={{ padding: '1rem 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                    <Title level={3} style={{ letterSpacing: '1.5px', color: '#8c8069', fontFamily: 'Georgia, serif', marginBottom: '0px' }}>
                                        {`${t('classes.features')}`.toUpperCase()}
                                    </Title>
                                    <Button
                                        type="text"
                                        icon={<PlusOutlined />}
                                        style={styles.addButton}
                                        onClick={handleStartAddFeature}
                                        disabled={isSubmittingFeature}
                                    >
                                        {t('classes.addFeature')}
                                    </Button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
                                    {editingFeatureIndex === -1 && (
                                        <FeatureForm
                                            onSave={handleAddFeature}
                                            onCancel={handleCancelFeature}
                                            featureTypeSelection={featureTypeSelection}
                                            isLoading={isSubmittingFeature}
                                        />
                                    )}
                                    {workshopClass.features.length === 0 && editingFeatureIndex !== -1 && (
                                        <EmptyListDisplay message={t('global.noData')} />
                                    )}
                                    {(() => {
                                        const groupedFeatures = workshopClass.features.reduce((acc, feature) => {
                                            const level = feature.level;
                                            if (!acc[level]) acc[level] = [];
                                            acc[level].push(feature);
                                            return acc;
                                        }, {} as Record<number, typeof workshopClass.features>);

                                        return Object.keys(groupedFeatures).map(Number).sort((a, b) => a - b).map(level => (
                                            <div key={level}>
                                                <div style={styles.levelHeader}>
                                                    <Text strong style={styles.levelHeaderText}>LEVEL {level}</Text>
                                                    <div style={styles.levelHeaderDivider} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                                    {groupedFeatures[level].map((feature, idx) => (
                                                        <div key={idx}>
                                                            {editingFeatureIndex === idx && featureToEdit?.name === feature.name ? (
                                                                <FeatureForm
                                                                    initialValues={feature}
                                                                    onSave={handleEditFeature}
                                                                    onCancel={handleCancelFeature}
                                                                    featureTypeSelection={featureTypeSelection}
                                                                    isEdit
                                                                    isLoading={isSubmittingFeature}
                                                                />
                                                            ) : (
                                                                <div style={styles.actionCard}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                                <Text style={styles.actionName}>{feature.name}</Text>
                                                                                <Tag color={feature.type === 'active' ? 'blue' : 'default'} style={{ textTransform: 'capitalize', borderRadius: '4px', fontSize: '10px' }}>
                                                                                    {t(`classes.${feature.type}`)}
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
                                                                                        onClick: () => handleStartEditFeature(feature, idx)
                                                                                    },
                                                                                    {
                                                                                        key: 'delete',
                                                                                        label: t('global.delete'),
                                                                                        danger: true,
                                                                                        icon: <DeleteOutlined />,
                                                                                        onClick: () => handleDeleteFeature(feature)
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
                                                                    <Text style={styles.actionDescription}>{feature.description}</Text>
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
                                    {workshopClass.spells.length === 0 ? (
                                        <EmptyListDisplay message={t('global.noData')} />
                                    ) : (
                                        workshopClass.spells.map((spell, idx) => (
                                            <div key={idx} style={styles.actionCard}>
                                                <Text style={styles.actionName}>{spell.name}</Text>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === ClassDisplayTabEnum.RESOURCES && (
                            <div style={{ padding: '1rem 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                    <Title level={3} style={{ letterSpacing: '1.5px', color: '#8c8069', fontFamily: 'Georgia, serif', marginBottom: '0px' }}>
                                        {`${t('classes.resources')}`.toUpperCase()}
                                    </Title>
                                    <Button
                                        type="text"
                                        icon={<PlusOutlined />}
                                        style={styles.addButton}
                                        onClick={handleStartAddResource}
                                        disabled={isSubmittingResource}
                                    >
                                        {t('classes.addResource')}
                                    </Button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    {editingResourceIndex === -1 && (
                                        <ClassResourceForm
                                            onSave={handleAddResource}
                                            onCancel={handleCancelResource}
                                            isLoading={isSubmittingResource}
                                            isWider
                                        />
                                    )}
                                    {workshopClass.resources.length === 0 && editingResourceIndex !== -1 && (
                                        <EmptyListDisplay message={t('global.noData')} />
                                    )}
                                    {workshopClass.resources.map((resource, idx) => (
                                        <div key={idx}>
                                            {editingResourceIndex === idx && resourceToEdit?.id === resource.id ? (
                                                <ClassResourceForm
                                                    initialValues={resource}
                                                    onSave={handleEditResource}
                                                    onCancel={handleCancelResource}
                                                    isEdit
                                                    imageUrlEdit={resource.image ?? undefined}
                                                    isLoading={isSubmittingResource}
                                                    isWider
                                                />
                                            ) : (
                                                <div style={styles.resourceCard}>
                                                    <div style={{ ...styles.resourceColorBar, backgroundColor: resource.color }} />
                                                    <div style={styles.resourceImageContainer}>
                                                        {resource.image ? (
                                                            <img src={resource.image} alt={resource.name} style={styles.resourceImage} />
                                                        ) : (
                                                            <div style={styles.resourceImagePlaceholder}>
                                                                <PictureOutlined style={{ fontSize: '1.2rem', color: '#8c7a52' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Text strong style={{ fontSize: '1rem' }}>{resource.name}</Text>
                                                            <Dropdown
                                                                menu={{
                                                                    items: [
                                                                        {
                                                                            key: 'edit',
                                                                            label: t('global.edit'),
                                                                            icon: <EditOutlined />,
                                                                            onClick: () => handleStartEditResource(resource, idx)
                                                                        },
                                                                        {
                                                                            key: 'delete',
                                                                            label: t('global.delete'),
                                                                            danger: true,
                                                                            icon: <DeleteOutlined />,
                                                                            onClick: () => handleDeleteResource(resource.id)
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
                                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                                                            <Tag color="orange" style={{ fontSize: '0.7rem', padding: '0 0.4rem', borderRadius: '4px' }}>
                                                                Short: {resource.resourceRecovery.shortRest.value} ({resource.resourceRecovery.shortRest.type})
                                                            </Tag>
                                                            <Tag color="purple" style={{ fontSize: '0.7rem', padding: '0 0.4rem', borderRadius: '4px' }}>
                                                                Long: {resource.resourceRecovery.longRest.value} ({resource.resourceRecovery.longRest.type})
                                                            </Tag>
                                                        </div>
                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                fontSize: '0.85rem',
                                                                lineHeight: '1.4'
                                                            }}
                                                        >
                                                            {resource.description}
                                                        </Text>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {activeTab === ClassDisplayTabEnum.SUBCLASS && (
                            <div style={{ padding: '1rem 0' }}>
                                {selectedSubclassId !== null ? (
                                    <div style={{ marginTop: '1rem' }}>
                                        <SubclassDisplay 
                                            subclassData={selectedSubclassData} 
                                            onBack={handleBackFromSubclass} 
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                            <Title level={3} style={{ letterSpacing: '1.5px', color: '#8c8069', fontFamily: 'Georgia, serif', marginBottom: '0px' }}>
                                                {`${t('classes.subclass')}`.toUpperCase()}
                                            </Title>
                                            {editingSubclassIndex === null && (
                                                <Button
                                                    type="text"
                                                    icon={<PlusOutlined />}
                                                    style={styles.addButton}
                                                    onClick={handleStartAddSubclass}
                                                    disabled={isSubmittingSubclass}
                                                >
                                                    {t('classes.addSubclass')}
                                                </Button>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                            {editingSubclassIndex === -1 && (
                                                <div style={{ backgroundColor: '#fff', border: '1px solid #e0dcd3', borderRadius: '0.75rem', padding: '1.5rem', marginTop: '1rem' }}>
                                                    <CreateSubclassForm
                                                        onCancel={handleCancelSubclass}
                                                        onSubmit={handleAddSubclass}
                                                        spells={spells}
                                                    />
                                                </div>
                                            )}
                                    {subclasses.length === 0 && editingSubclassIndex === null && (
                                        <EmptyListDisplay message={t('global.noData')} />
                                    )}
                                    {subclasses.map((subclass, idx) => (
                                        <div key={idx}>
                                            {editingSubclassIndex === idx ? (
                                                <div style={{ backgroundColor: '#fff', border: '1px solid #e0dcd3', borderRadius: '0.75rem', padding: '1.5rem' }}>
                                                    <EditSubclassForm
                                                        subclassData={subclassToEdit}
                                                        onCancel={handleCancelSubclass}
                                                        onSubmit={handleEditSubclass}
                                                        spells={spells}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    style={{
                                                        ...styles.resourceCard,
                                                        cursor: 'pointer',
                                                        boxShadow: hoveredIndex === idx ? '0 0 0px 2px orange' : 'none',
                                                        transition: 'box-shadow 0.3s ease',
                                                    }}
                                                    onMouseEnter={() => handleHover(idx)}
                                                    onMouseLeave={() => handleHover(null)}
                                                    onClick={() => handleSelectSubclass(subclass.id)}
                                                >
                                                    <div style={styles.resourceImageContainer}>
                                                        {subclass.image ? (
                                                            <img src={subclass.image} alt={subclass.name} style={styles.resourceImage} />
                                                        ) : (
                                                            <div style={styles.resourceImagePlaceholder}>
                                                                <PictureOutlined style={{ fontSize: '1.2rem', color: '#8c7a52' }} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Text strong style={{ fontSize: '1rem' }}>{subclass.name}</Text>
                                                            <Dropdown
                                                                menu={{
                                                                    items: [
                                                                        {
                                                                            key: 'edit',
                                                                            label: t('global.edit'),
                                                                            icon: <EditOutlined />,
                                                                            onClick: () => handleStartEditSubclass(idx, subclass.id)
                                                                        },
                                                                        {
                                                                            key: 'delete',
                                                                            label: t('global.delete'),
                                                                            danger: true,
                                                                            icon: <DeleteOutlined />,
                                                                            onClick: () => handleDeleteSubclass(subclass.id)
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
                                                        <Text
                                                            type="secondary"
                                                            style={{
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                fontSize: '0.85rem',
                                                                lineHeight: '1.4',
                                                                marginTop: '0.5rem'
                                                            }}
                                                        >
                                                            {subclass.description}
                                                        </Text>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                </>
                                )}
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
    spellcastingContainer: {
        marginTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        maxWidth: '30rem',
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
    weaponPropCard: {
        border: '1px solid #d3c9b3',
        borderRadius: '6px',
        padding: '0.8rem 1rem',
        backgroundColor: '#fcfbf9'
    },
    weaponPropName: {
        display: 'block',
        fontSize: '1rem',
        color: '#4a463d',
        marginBottom: '0.25rem'
    },
    weaponPropDesc: {
        fontSize: '0.9rem',
        color: '#8c8069',
        lineHeight: '1.5'
    },
    rangeValue: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#d35400',
        fontFamily: 'Georgia, serif'
    },
    itemDetailsChild: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.2rem 0',
        borderBottom: '1px solid #e0dcd2',
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
    },
    imagePreviewContainer: {
        width: '22rem',
        aspectRatio: '1 / 1',
        borderColor: '#f1efe5',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderRadius: '8px',
        padding: '0',
        overflow: 'hidden',
        marginTop: '1rem',
        backgroundColor: 'white',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    levelHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '1rem',
    },
    levelHeaderText: {
        fontSize: '1rem',
        color: '#8c8069',
        letterSpacing: '2px',
        whiteSpace: 'nowrap',
    },
    levelHeaderDivider: {
        flex: 1,
        height: '1px',
        backgroundColor: '#e0dcd2',
    },
    addButton: {
        color: '#d35400',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
    },
    menuButton: {
        color: '#8c8069',
        padding: '4px',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resourceCard: {
        backgroundColor: '#fff',
        border: '1px solid #e0dcd3',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        position: 'relative',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
    },
    resourceColorBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '4px',
        borderTopLeftRadius: '0.75rem',
        borderBottomLeftRadius: '0.75rem',
    },
    resourceImageContainer: {
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        flexShrink: 0,
        border: '1px solid #e0dcd3',
        backgroundColor: '#f5f2ea',
    },
    resourceImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    resourceImagePlaceholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 2rem',
        backgroundColor: '#fcfbf9',
        borderRadius: '1rem',
        border: '2px dashed #d3c9b3',
        marginTop: '1rem',
        textAlign: 'center',
    },
};