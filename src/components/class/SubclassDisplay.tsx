import { useState } from "react";
import { Button, Typography, Skeleton, Tag } from "antd";
import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

// components
import DisplaySectionHeader from "@/components/global/common/DisplaySectionHeader";

// assets
import { noItemImage, SparklesIcon } from "@/assets";

// interfaces
import type { ClassDetailRead } from "@/models/classInterfaces";
import { ClassDisplayTabEnum } from "@/utils/enums";

interface Props {
    subclassData: ClassDetailRead | null;
    onBack: () => void;
}

const { Text, Title } = Typography;

export default function SubclassDisplay({ subclassData, onBack }: Props) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<string>(ClassDisplayTabEnum.OVERVIEW);

    const tabs: { key: string, label: string }[] = [
        { key: ClassDisplayTabEnum.OVERVIEW, label: t('classes.overview') },
        { key: ClassDisplayTabEnum.FEATURES, label: t('classes.features') },
        { key: ClassDisplayTabEnum.RESOURCES, label: t('classes.resources') },
    ];

    if (subclassData && subclassData.spells && subclassData.spells.length > 0) {
        tabs.push({ key: ClassDisplayTabEnum.SPELLS, label: t('workshop.spells') });
    }

    if (!subclassData) {
        return (
            <div style={styles.container}>
                <div style={styles.leftSideContent}>
                    <div style={styles.backButtonRow}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            type="text"
                            onClick={onBack}
                            style={{ fontWeight: 'bold' }}
                        >
                            {t('global.back')}
                        </Button>
                    </div>
                    <Skeleton.Image active style={{ width: '100%', height: '18rem', borderRadius: '8px', marginTop: '1rem' }} />
                    <div style={{ marginTop: '2rem' }}>
                        <Skeleton active paragraph={{ rows: 4 }} title={false} />
                    </div>
                </div>
                <div style={styles.rightSideContent}>
                    <Skeleton.Input active size="large" style={{ width: '60%', height: 40, marginBottom: '2rem' }} />
                    <Skeleton active paragraph={{ rows: 5 }} />
                    <div style={{ marginTop: '2rem' }}>
                        <Skeleton active paragraph={{ rows: 6 }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.leftSideContent}>
                <div style={styles.backButtonRow}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        type="text"
                        onClick={onBack}
                        style={{ fontWeight: 'bold' }}
                    >
                        {t('global.back')}
                    </Button>

                    {subclassData.spellcastingProperties && (
                        <Tag
                            color="purple"
                            variant="outlined"
                            style={styles.pill}
                        >
                            <SparklesIcon style={{ marginRight: 6, opacity: 0.8 }} />
                            Spellcaster
                        </Tag>
                    )}
                </div>

                <div style={styles.imagePreviewContainer}>
                    {subclassData.image ? (
                        <img src={subclassData.image} alt={subclassData.name} style={styles.imagePreview} />
                    ) : (
                        <img src={noItemImage} alt={subclassData.name} style={styles.imagePreview} />
                    )}
                </div>

                <div style={styles.itemDetails}>
                    <div style={styles.itemDetailsChild}>
                        <Text style={{ width: '40%', textTransform: 'uppercase' }}>{t('classes.hitDie')}</Text>
                        <Text strong style={{ textAlign: 'right' }}>{subclassData.hitDie}</Text>
                    </div>
                </div>
            </div>

            <div style={styles.rightSideContent}>
                <div style={styles.rightSideTitleContainer}>
                    <Title level={1} style={styles.rightSideTitle}>{subclassData.name}</Title>
                </div>

                <div style={styles.tabsContainer}>
                    {tabs.map(tab => (
                        <div
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
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

                <div style={styles.contentContainer}>
                    {activeTab === ClassDisplayTabEnum.OVERVIEW && (
                        <div style={{ padding: '1rem 0' }}>
                            <DisplaySectionHeader icon={<InfoCircleOutlined />} title={`${t('classes.description')}`.toUpperCase()} />
                            <div style={styles.descriptionText}>
                                {subclassData.description.split('\n').map((line, idx) => (
                                    <p key={idx} style={{ margin: line.trim() ? '0 0 1rem 0' : '0' }}>{line}</p>
                                ))}
                            </div>

                            {subclassData.spellcastingProperties && (
                                <>
                                    <div style={{ marginTop: '2rem' }}>
                                        <DisplaySectionHeader icon={<SparklesIcon />} title={`${t('classes.spellcastingProperties')}`.toUpperCase()} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                        <div style={{ ...styles.spellSaveBox, border: '1px solid #b6d4fe', backgroundColor: '#f0f8ff' }}>
                                            <Text strong style={styles.spellSaveLabel}>{`${t('classes.spellcastingAbility')}`.toUpperCase()}</Text>
                                            <Text strong style={{ fontSize: '1.1rem', color: '#0d6efd' }}>{String(subclassData.spellcastingProperties.spellcastingAbility).toUpperCase()}</Text>
                                        </div>
                                        <div style={{ ...styles.spellSaveBox, border: '1px solid #d3c9b3', backgroundColor: '#f5f2ea' }}>
                                            <Text strong style={styles.spellSaveLabel}>{`${t('classes.spellcastingType')}`.toUpperCase()}</Text>
                                            <Text strong style={{ fontSize: '1.1rem', color: '#4a463d' }}>{t(`classes.${subclassData.spellcastingProperties.spellcastingType}`)}</Text>
                                        </div>
                                        <div style={{ ...styles.spellSaveBox, border: '1px solid #d3c9b3', backgroundColor: '#f5f2ea' }}>
                                            <Text strong style={styles.spellSaveLabel}>{`${t('classes.preparationType')}`.toUpperCase()}</Text>
                                            <Text strong style={{ fontSize: '1.1rem', color: '#4a463d' }}>{t(`classes.${subclassData.spellcastingProperties.preparationType}`)}</Text>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === ClassDisplayTabEnum.FEATURES && (
                        <div style={{ padding: '0' }}>
                            {subclassData.features.length === 0 ? (
                                <Text type="secondary" style={{ display: 'block', marginTop: '1rem' }}>{t('global.noData')}</Text>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
                                    {(() => {
                                        const groupedFeatures = subclassData.features.reduce((acc, feature) => {
                                            const level = feature.level;
                                            if (!acc[level]) acc[level] = [];
                                            acc[level].push(feature);
                                            return acc;
                                        }, {} as Record<number, typeof subclassData.features>);

                                        return Object.keys(groupedFeatures).map(Number).sort((a, b) => a - b).map(level => (
                                            <div key={level}>
                                                <div style={styles.levelHeader}>
                                                    <Text strong style={styles.levelHeaderText}>LEVEL {level}</Text>
                                                    <div style={styles.levelHeaderDivider} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                                    {groupedFeatures[level].map((feature, idx) => (
                                                        <div key={idx} style={styles.featureCard}>
                                                            <div style={styles.featureHeader}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                    <Text strong style={{ fontSize: '1rem' }}>{feature.name}</Text>
                                                                    <div style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: '#e2dcd0', fontSize: '0.75rem', fontWeight: 'bold', color: '#6b6352' }}>
                                                                        {String(t(`classes.${feature.type}`)).toUpperCase()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={styles.featureContent}>
                                                                <Text style={{ whiteSpace: 'pre-line' }}>{feature.description}</Text>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === ClassDisplayTabEnum.RESOURCES && (
                        <div style={{ padding: '0' }}>
                            {subclassData.resources.length === 0 ? (
                                <Text type="secondary" style={{ display: 'block', marginTop: '1rem' }}>{t('global.noData')}</Text>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    {subclassData.resources.map((resource, idx) => (
                                        <div key={idx} style={{ ...styles.resourceCard, cursor: 'default' }}>
                                            <div style={styles.resourceImageContainer}>
                                                <img src={resource.image || noItemImage} alt={resource.name} style={styles.resourceImage} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <Text strong style={{ fontSize: '1rem' }}>{resource.name}</Text>
                                                <Text type="secondary" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.85rem', lineHeight: '1.4', marginTop: '0.5rem' }}>
                                                    {resource.description}
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === ClassDisplayTabEnum.SPELLS && (
                        <div style={{ padding: '0' }}>
                            {subclassData.spells.length === 0 ? (
                                <Text type="secondary" style={{ display: 'block', marginTop: '1rem' }}>{t('global.noData')}</Text>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    {subclassData.spells.map((spell, idx) => (
                                        <div key={idx} style={{ ...styles.resourceCard, cursor: 'default' }}>
                                            <div style={styles.resourceImageContainer}>
                                                <img src={spell.image || noItemImage} alt={spell.name} style={styles.resourceImage} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Text strong style={{ fontSize: '1rem' }}>{spell.name}</Text>
                                                    <div style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: '#e2dcd0', fontSize: '0.75rem', fontWeight: 'bold', color: '#6b6352' }}>
                                                        {spell.level === 0 ? t('spells.cantrip') : `Level ${spell.level}`}
                                                    </div>
                                                </div>
                                                <Text type="secondary" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.85rem', lineHeight: '1.4', marginTop: '0.5rem' }}>
                                                    {spell.description}
                                                </Text>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        backgroundColor: '#f5f2ea',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e0dcd3',
        height: 'calc(100vh - 16rem)',
    },
    leftSideContent: {
        width: '30%',
        minWidth: '20rem',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    backButtonRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1rem'
    },
    pill: {
        display: 'flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 'bold',
        height: 'fit-content'
    },
    rightSideContent: {
        flex: 1,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        padding: '2rem',
        backgroundColor: '#FEFDFA',
        borderLeft: '1px solid #C2BAA6',
        display: 'flex',
        flexDirection: 'column',
    },
    imagePreviewContainer: {
        width: '100%',
        aspectRatio: '1 / 1',
        borderColor: '#f1efe5',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderRadius: '8px',
        padding: '0',
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    itemDetails: {
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    itemDetailsChild: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e0dcd2ff',
        padding: '0.5rem 0px'
    },
    rightSideTitleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
    },
    rightSideTitle: {
        margin: 0,
        fontFamily: 'Georgia, serif',
        color: '#4a463d',
        fontWeight: 'normal'
    },
    tabsContainer: {
        display: 'flex',
        borderBottom: '1px solid #C2BAA6',
        marginBottom: '1rem',
    },
    tabItem: {
        padding: '0.5rem 1.5rem',
        cursor: 'pointer',
        borderBottomWidth: '3px',
        borderBottomStyle: 'solid',
        transition: 'all 0.2s ease',
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
        flex: 1,
        overflowY: 'auto',
    },
    descriptionText: {
        marginTop: '1rem',
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#4a463d'
    },
    spellSaveBox: {
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem 0.75rem',
        minWidth: '120px',
    },
    spellSaveLabel: {
        fontSize: '0.7rem',
        color: '#8c8069',
        letterSpacing: '1px',
        marginBottom: '0.5rem',
        textAlign: 'center'
    },
    featureCard: {
        backgroundColor: '#fff',
        border: '1px solid #e0dcd3',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
    },
    featureHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.5rem'
    },
    levelBadge: {
        backgroundColor: '#4a463d',
        color: '#fff',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        letterSpacing: '0.5px'
    },
    featureContent: {
        color: '#5c574c',
        lineHeight: '1.5',
        fontSize: '0.95rem'
    },
    resourceCard: {
        display: 'flex',
        gap: '1.25rem',
        backgroundColor: '#fff',
        border: '1px solid #e0dcd3',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        position: 'relative'
    },
    resourceImageContainer: {
        width: '4rem',
        height: '4rem',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        border: '1px solid #f0eee9',
        backgroundColor: '#f8f6f0',
        flexShrink: 0
    },
    resourceImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    levelHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
    },
    levelHeaderText: {
        fontSize: '0.85rem',
        color: '#8c8069',
        letterSpacing: '1.5px',
        whiteSpace: 'nowrap',
    },
    levelHeaderDivider: {
        flex: 1,
        height: '1px',
        backgroundColor: '#e0dcd3',
    },
};
